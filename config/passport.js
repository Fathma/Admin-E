//  Author: Fathma Siddique
//  Create Date: 02/05/2019
//  Modify Date: 02/05/2019
//  Description: this file is to configuring passport js for authentication 

const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = mongoose.model("users");

// user authentication by passport.js localstrategy. 
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // checks whether user already exists or not
      User.findOne({ email }).then(user => {
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        // matches the given password with the encrypted password 
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );


  // serializes the user id in the session
  passport.serializeUser( (user, done)=>{
    done(null, user.id);
  });
  

  // gets the user id form session and gets user info by that id
  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  });
};
