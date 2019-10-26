// author : fathma Siddique
// lastmodified : 31/7/2019
// description : all the user related controllers/funtions are written in here 

const bcrypt = require('bcryptjs')
const passport = require('passport')
const Validation = require('../../static/js/validations')
const Email = require('../../config/email')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 
const User = require('../models/user.model')
const keys = require('../../config/keys')

// User login route
exports.loginPage = (req, res, next) => res.render('users/login')


// User register route
exports.registrationPage = (req, res) => res.render('users/register')


// Login form POST
exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/general/showDashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
}


// Register form POST
exports.userregistration = async(req, res, next) => {
  const { name, branch, role, password, password2, email } = req.body
  var errors = await Validation.userValidation(req)
  if( !errors ) errors = []
  if ( password != password2 ) errors.push({ msg: 'Passwords do not match' })
  if ( password.length < 4 ) errors.push({ msg: 'Password must be at least 4 characters' })

  if ( errors.length > 0 ) {
    res.render('users/register', { errors, name, email, branch, password, password2, role })
  } else {
    User.findOne({ email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered.')
        res.redirect('/users/register')
      } else {
        const newUser = new User({ name, email, branch, password, role })

        bcrypt.genSalt( 10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then( user => {
                req.flash( 'success_msg', 'You are now registered and can log in')
                res.redirect('/users/register')
              })
              .catch(err => {
                console.log(err)
                return
              })
          })
        })
      }
    })
  }
}


// Logout user
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/users/login')
};


// shows all user
exports.getUsers = (req, res)=>{
  User.find((err, users)=>{
    var count = 1;
    users.map( doc=> doc.count = count++ )
    res.render('users/viewUserList',{users})
  })
}


// edit user update page
exports.edit = (req, res)=>{
  User.findOne({ _id: req.params.id }, (err, user)=> res.render('users/updateUser',{ user }))
}

// save edit
exports.saveEdit = (req, res)=>{
  User.update({ _id: req.body._id}, { $set: req.body },(err, user)=>{
    req.flash('success_msg','Info has updated')
    res.redirect('/users/getUsers')
  })
}


// show user profile
exports.profile = async (req, res)=>{
  let user =await User.findOne({ _id: req.params.id })
  res.render('users/profile', { user })
}


// changing user password by sending a temporary link to the use email
exports.changePass = async (req, res)=>{

  let user = await User.findOne({_id: req.params.id})
    
  jwt.sign({ user: _.pick(user, '_id') }, keys.jwt.secret, { expiresIn:'30s' }, async (err, token)=> {
    let url = `http://localhost:3000/users/changePassPage/${token}`
    await Email.sendEmail( 'devtestjihad@gmail.com', user.email, 'Password Change', `<a href='${url}'>${url}</a>` );
      req.flash('success_msg', 'A token has been sent to your email.')
      res.redirect(`/users/profile/${user._id}`)
  })

}


// redirects to a temporary page
exports.changePassPage = (req, res)=>{
  try{
    const { user } = jwt.verify(req.params.token, keys.jwt.secret) 
    if(user){
      res.render('users/setPass', { id: user._id, token: req.params.token })
    }
  }catch(err){
    res.send("Session Expired!")
  }
  
}


// saves the ne pass
exports.SaveNewPass = (req, res)=>{

  var { _id, password, password2, token } = req.body;
  
  if ( password != password2 ) {
    req.push('error_msg', 'Passwords do not match' )
    res.redirect('/users/changePassPage'+token)
  }

  bcrypt.genSalt( 10, (err, salt) => {
    bcrypt.hash( password, salt, (err, hash) => {
      if (err) throw err
      password = hash
      User.update({_id},{$set:{password:password}},(err, user) => {
        req.flash( 'success_msg', 'Your Password is changed successfully')
        res.redirect('/users/profile/'+_id)
      })
    })
  })
}