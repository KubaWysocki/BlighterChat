const jwt = require('jsonwebtoken')

const {JWT_SECRET_KEY} = require('../util/constants')

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  let decodedToken
  try {
    decodedToken = token && jwt.verify(token, JWT_SECRET_KEY)
  }
  catch(error) {
    error.status = 500
    throw error
  }
  if (!decodedToken) throw {status: 401, message: 'Not authenticated'}
  req.userId = decodedToken.userId
  next()
}