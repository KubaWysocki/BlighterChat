const User = require('../models/User')
const ApiError = require('../util/ApiError')
const decodeToken = require('../util/decodeToken')

module.exports = async(req, res, next) => {
  const token = req.cookies.JWT
  const authError = new ApiError(401, 'Not authenticated')
  if (!token) throw authError

  let decodedToken
  try {
    decodedToken = decodeToken(token)
    if (!decodedToken) throw {}
  }
  catch {
    throw authError
  }

  const user = await User.findById(decodedToken._id)
  if (!user) throw new ApiError(401, 'User not found')

  req.user = user
  next()
}