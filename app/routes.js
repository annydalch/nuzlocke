'use strict'

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.pug')
  })
  app.get('/login', (req, res) => {
    res.render('login.pug', { message: req.flash('loginMessage') })
  })
  app.get('/signup', (req, res) => {
    res.render('signup.pug', { message: req.flash('signupMessage') })
  })
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.pug', {
      user: req.user
    })
  })
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}
