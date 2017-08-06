'use strict'

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const configDB = require('./config/database.js')

const sessionSecret = require('./config/secret.js')

require('./config/passport')(passport)

const app = express()
const port = process.env.PORT || 8080

mongoose.connect(configDB.url, { useMongoClient: true })

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')

app.use(session({ secret: sessionSecret }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./app/routes.js')(app, passport)

app.listen(port)
console.log('listening on port ' + port)
