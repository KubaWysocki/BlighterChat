const jwt = require('jsonwebtoken')

module.exports = (token) => {
  let decodedToken
  try {
    decodedToken = token && jwt.verify(token, process.env.TOKEN_SECRET)
  }
  catch(error) {
    error.status = 500
    throw error
  }
  return decodedToken
}