const User = require('../models/User')
const ApiError = require('../util/ApiError')
const decodeToken = require('../util/decodeToken')

module.exports = async(req, res, next) => {
  const token = req.cookies.JWT
  const auth_error = new ApiError(401, 'Not authenticated')
  if (!token) throw auth_error

  let decodedToken
  try {
    decodedToken = decodeToken(token)
    if (!decodedToken) throw {}
  }
  catch {
    throw auth_error
  }

  const user = await User.findById(decodedToken._id)
  if (!user) throw new ApiError(401, 'User not found')

  req.user = user
  next()
}