'use strict'

const sinnoh = require('../regions/platinum.json')

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.pug', buildConfig(req))
  })
  app.get('/login', notLoggedIn, (req, res) => {
    res.render('login.pug', {
      message: req.flash('loginMessage'),
      authorized: req.isAuthenticated()
    })
  })
  app.get('/signup', notLoggedIn, (req, res) => {
    res.render('signup.pug', buildConfig(req))
  })

  app.get('/platinum', isLoggedIn, async (req, res) => {
    let config = buildConfig(req)
    config.region = sinnoh
    res.render('nuzlocke.pug', config)
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.pug', {
      user: req.user,
      authorized: req.isAuthenticated()
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

const buildConfig = (req) => {
  let authenticated = req.isAuthenticated()
  let config = {}
  if (authenticated) {
    let user = req.user
    config.user = user
  } else {
    config.user = null
  }
  return config
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

const notLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/profile')
  }

  return next()
}
