const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/users');
const authenticate = require('../authenticate');
const cors = require('./cors'); // Import the cors module

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); }); // Handle preflight requests

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
});



router.post('/signup', cors.corsWithOptions, async (req, res, next) => {
  try {
    const user = await User.register(new User({
      username: req.body.username
    }), req.body.password);
    
    if (req.body.firstname) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    
    await user.save();
    
    passport.authenticate('local')(req, res, () => {
      res.status(200).json({
        success: true,
        status: 'Registration Successful!'
      });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({
    _id: req.user._id,
    firstname: req.user.firstname,
    lastname: req.user.lastname
  });

  res.status(200).json({
    success: true,
    status: 'You are successfully logged in!',
    token: token
  });
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('session-id');
      res.redirect('/');
    });
  } else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

  
module.exports = router;
