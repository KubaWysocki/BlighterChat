/*eslint-disable mocha/no-top-level-hooks, mocha/no-hooks-for-single-case*/
const mongoose = require('mongoose')

const {MONGO_DB_TEST_URI, MONGO_DB_CONNECTION_OPTIONS} = require('../util/constants')

before(function() {
  return mongoose.connect(MONGO_DB_TEST_URI, MONGO_DB_CONNECTION_OPTIONS)
})

after(function() {
  return mongoose.disconnect()
})