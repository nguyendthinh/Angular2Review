const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

  // REGISTER ROUTE (create users) //

  router.post('/register', (req, res) => {

    if (!req.body.email) {
      res.json({success: false, message: 'You must provide an email'})
    }
    else if (!req.body.username) {
      res.json({success: false, message: 'You must provide a username'})
    }
    else if (!req.body.password) {
      res.json({success: false, message: 'You must provide a password'})
    }

    else {
      let user = new User({
        email: req.body.email.toLowerCase(),
        username: req.body.username.toLowerCase(),
        password: req.body.password
      })

      // Save user to database //

      user.save((err) => {

        if (err) {
          // Check to see if error is due to an already existing account
          if (err.code === 11000) {
            res.json({success: false, message: 'Username or email already exists'})
          }
          else if (err.errors.email) {
            res.json({success: false, message: err.errors.email.message})
          }
          else if (err.errors.username) {
            res.json({success: false, message: err.errors.username.message})
          }
          else if (err.errors.password) {
            res.json({success: false, message: err.errors.password.message})
          }
          else {
            res.json({success: false, message: 'Could not save user. Error: ', err})
          }
        }

        else {
          res.json({success: true, message: 'Account Register!'})
        }
      });

    }
  })

  // LOGIN ROUTE (log users in through authentication)

  router.post('/login', (req, res) => {
    if (!req.body.username) {
      res.json({success: false, message: 'Username was not provided'});
    }
    else if (!req.body.password) {
      res.json({success: false, message: 'Password was not provided'});
    }
    else {
      User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
        if (err) {
          res.json({success: false, message: err})
        }
        else if (!user) {
          res.json({success: false, message: 'Username not found'})
        }
        else {
          const validPassword = user.comparePassword(req.body.password); //compare password provided to password in database
          if (!validPassword) {
            res.json({success: false, message: 'Password invalid'})
          } else {

            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h'}); //create token for client if login was successful

            res.json({success: true, message: 'Success!', token: token, user: { username: user.username}})
          }
        }
      })
    }
  })

  // CHECK IF USER'S USERNAME IS AVAILABLE FOR REGISTRATION //

  router.get('/checkUsername/:username', (req, res) => {
    if (!req.params.username){
      res.json({success: false, message: 'Username was not provided'});
    } else {
      User.findOne({ username: req.params.username}, (err, user) => {
        if (err) {
          res.json({success: false, message: err})
        }
        else if (user) {
          res.json({success: false, message: 'Username is already taken'})
        }
        else {
          res.json({success: true, message: 'Username is available'})
        }
      })
    }
  })

  // CHECK IF USER'S EMAIL IS AVAILABLE FOR REGISTRATION //

  router.get('/checkEmail/:email', (req, res) => {
    if (!req.params.email){
      res.json({success: false, message: 'Email was not provided'});
    } else {
      User.findOne({ email: req.params.email}, (err, user) => {
        if (err) {
          res.json({success: false, message: err})
        }
        else if (user) {
          res.json({success: false, message: 'Email is already taken'})
        }
        else {
          res.json({success: true, message: 'Email is available'})
        }
      })
    }
  })

  // MIDDLEWARE: grab user's token from headers for authentication

  router.use((req, res, next) => {
    const token = req.headers['authorization']; //create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({success: false, message: 'No token provided'});
    }
    else {
      // Check to see if token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({success: false, message: err}); //Token either expired or is invalid
        }
        else {
          req.decoded = decoded;  //create global variable to use in any request during the user's logged in session
          next(); //exit middleware <--- IMPORTANT
        }
      })
    }
  });

  // USER'S PROFILE DATA

  router.get('/profile', (req, res) => {
    // Search for user in database by using decoded userId from token. select method returns on the user's username and email info
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
      if (err) {
        res.json({success: false, message: err});
      }
      else if (!user) {
        res.json({success: false, message: 'User not found'});
      }
      else {
        res.json({success: true, user: user}); //send user object to be accessed in frontend
      }
    })
  })

  return router;
}
