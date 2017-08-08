'use strict'

const Run = require('./models/run.js')
const games = require('../regions/regions.json').games

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

  app.get('/myruns', isLoggedIn, (req, res) => {
    let config = buildConfig(req)
    Run.find({ user: req.user.name }, async (err, runs) => {
      if (err) throw err
      config.runs = runs
      res.render('myruns.pug', config)
    })
  })

  app.get('/newrun', isLoggedIn, (req, res) => {
    let config = buildConfig(req)
    config.games = games
    res.render('newrun.pug', config)
  })

  app.post('/newrun', isLoggedIn, (req, res) => {
    let newRun = new Run()
    newRun.user = req.user.name
    newRun.game = req.body.game
    newRun.name = req.body.runName
    let region = require('../regions/' + req.body.game + '.json').locations
    let locations = []
    for (let place of region) {
      locations.push({ name: place, captured: false })
    }
    newRun.locations = locations
    newRun.save(err => {
      if (err) {
        res.redirect('/newrun')
      } else {
        res.redirect('/run/' + newRun.id)
      }
    })
  })

  app.get('/run/:id', isLoggedIn, (req, res) => {
    Run.findById(req.params.id, (err, run) => {
      if (err) throw err
      if (!run) {
        res.status(404)
          .redirect('/myruns')
      } else {
        let config = buildConfig(req)
        config.run = run
        res.render('nuzlocke.pug', config)
      }
    })
  })

  app.post('/run/:id', isLoggedIn, (req, res) => {
    Run.findById(req.params.id, (err, run) => {
      if (err) throw err
      if (!run) {
        res.status(404)
          .redirect('/myruns')
      } else {
        for (let location of run.locations) {
          if (req.body[location.name]) {
            location.captured = req.body[location.name]
          }
        }
        run.save(err => {
          if (err) throw err
          res.redirect('/run/' + req.params.id)
        })
      }
    })
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
  let config = {}
  config.authorized = req.isAuthenticated()
  if (config.authorized) {
    config.user = req.user
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
