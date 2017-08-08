'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 8

const userSchema = mongoose.Schema({
  name: String,
  password: String
})

userSchema.methods.generateHash = function (password) {
  return bcrypt.hash(password, saltRounds)
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
