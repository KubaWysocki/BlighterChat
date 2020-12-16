const jwt = require('jsonwebtoken')

const {JWT_SECRET_KEY} = require('./constants')

module.exports = (token) => {
  let decodedToken
  try {
    decodedToken = token && jwt.verify(token, JWT_SECRET_KEY)
  }
  catch(error) {
    error.status = 500
    throw error
  }
  return decodedToken
}