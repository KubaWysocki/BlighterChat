const User = require('../models/User')
const ApiError = require('../util/ApiError')
const decodeToken = require('../util/decodeToken')

module.exports = async(req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]
  const decodedToken = decodeToken(token)
  if (!decodedToken) throw new ApiError(401, 'Not authenticated')
  req.user = await User.findById(decodedToken._id)
  next()
}