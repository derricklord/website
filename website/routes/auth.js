var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var path = require('path');
var qs = require('querystring');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
//var async = require('async');
//var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');

var config = require('../config');
var util = require('../lib/util.js');
var User = require('../models/users');


var router = express.Router();


//Login with Email & Password
router.post('/login', function(req, res){
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      res.send({ token: util.createToken(user)});
    });
  });
});


//Signup with Email & Password
router.post('/signup', function(req, res){
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      isAdmin: false
    });

    user.save(function() {
      res.send({ token: util.createToken(user)});
    });
  });
});


//Authenticate with Google
router.post('/google', function(req, res){
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

  // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
    
      // Step 3a. Link user accounts.
      //console.log('Header Information: ' + req.headers.authorization);
      if (req.headers.authorization) {
          //console.log('Step 3a. Looking for existing google user...');
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.email = user.email || profile.email;
            user.isEnrolled = false;
             
              
          if(profile.hd){
              
            if(profile.hd === 'ethompson.org' && profile.email === 'dlord@ethompson.org'){
                user.isAdmin = true;
                user.isEnrolled = true;
            }else{
                user.isAdmin = false;
                user.isEnrolled = true;
            }
          }else{
            if(profile.email === 'derrick.lord@gmail.com'){
                user.isAdmin = true;
                user.isEnrolled = true;
            }else{
                user.isEnrolled = false;
            }
          }
              
              
            user.save(function() {
              var token = util.createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
      
          
      // Step 3b. Create a new user account or return an existing one.
        //Step 3b. Looking for existing google user...
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
              //Found existing user, and creating token...        
            return res.send({ token: util.createToken(existingUser)});
          }
          //Creating new user...
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.email = profile.email;
          user.isEnrolled = false;
          
          if(profile.hd){
            if(profile.hd === 'ethompson.org' && profile.email === 'dlord@ethompson.org'){
                user.isAdmin = true;
                user.isEnrolled = true;
            }else{
                user.isAdmin = false;
                user.isEnrolled = true;
            }
          }else{
            if(profile.email === 'derrick.lord@gmail.com'){
                user.isAdmin = true;
                user.isEnrolled = true;
            }else{
                user.isEnrolled = false;
            }
          }
            
          //About to create user;  
            
          user.save(function(err) {
            var token = util.createToken(user);
            res.send({ token: token}); 
          });
        });
      }
    });
  });
});

router.get('/unlink/:provider', util.ensureAuthenticated, function(req, res){
  var provider = req.params.provider;
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});


module.exports = router;