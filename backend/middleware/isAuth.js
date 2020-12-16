const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../util/ApiError')

const {JWT_SECRET_KEY} = require('../util/constants')

module.exports = async(req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  let decodedToken
  try {
    decodedToken = token && jwt.verify(token, JWT_SECRET_KEY)
  }
  catch(error) {
    error.status = 500
    throw error
  }
  if (!decodedToken) throw new ApiError(401, 'Not authenticated')
  req.user = await User.findById(decodedToken._id)
  next()
}