'use strict'

const mongoose = require('mongoose')

const runSchema = mongoose.Schema({
  user: String,
  locations: [{ name: String, captured: Boolean }],
  name: String,
  game: String
})

runSchema.methods.equalP = function (other) {
  if (other !== Object(other)) {
    return false
  }
  return other.user === this.user
}

module.exports = mongoose.model('Run', runSchema)
