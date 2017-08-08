'use strict'

const LocalStrategy = require('passport-local').Strategy

const User = require('../app/models/user.js')

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'name',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, name, password, done) {
      User.findOne({ name: name }, async (err, user) => {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use'))
        } else {
          let newUser = new User()
          newUser.name = name
          newUser.password = await newUser.generateHash(password)
          newUser.save(err => {
            if (err) throw err
          })
          return done(null, newUser)
        }
      })
    }))

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'name',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, name, password, done) {
      User.findOne({ name: name }, async (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found'))
        }
        if (!(await user.validPassword(password))) {
          return done(null, false, req.flash('loginMessage', 'Wrong password'))
        }

        return done(null, user)
      })
    }))
}
