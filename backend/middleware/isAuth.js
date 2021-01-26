const User = require('../models/User')
const ApiError = require('../util/ApiError')
const decodeToken = require('../util/decodeToken')

module.exports = async(req, res, next) => {
  const token = req.cookies.JWT
  if (!token) throw new ApiError(401, 'Not authenticated')

  let decodedToken
  try {
    decodedToken = decodeToken(token)
  }
  catch {
    throw new ApiError(401, 'Not authenticated')
  }

  const user = await User.findById(decodedToken._id)
  if (!user) throw new ApiError(401, 'User not found')
  req.user = user

  next()
}