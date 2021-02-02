const User = require('../models/User')
const ApiError = require('../util/ApiError')
const decodeToken = require('../util/decodeToken')

module.exports = async(req, res, next) => {
  const token = req.cookies.JWT
  const auth_error = new ApiError(401, 'Not authenticated')
  if (!token) {
    next(auth_error)
    return auth_error
  }

  let decodedToken
  try {
    decodedToken = decodeToken(token)
  }
  catch {
    next(auth_error)
    return auth_error
  }

  const user = await User.findById(decodedToken._id)
  if (!user) {
    const user_error = new ApiError(401, 'User not found')
    next(user_error)
    return user_error
  }
  req.user = user

  next()
}