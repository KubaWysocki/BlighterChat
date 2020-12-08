const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const {JWT_SECRET_KEY} = require('../util/constants')

exports.signup = async(req, res) => {
  const {email, username, password} = req.body
  const users = await User.find({$or: [{email}, {username}]}).exec()
  if (users.length) {
    const errors = {}
    users.forEach(user => {
      if (user.username === username) errors.username = 'Username already taken'
      if (user.email === email) errors.email = 'Email already in use'
    })
    throw errors
  }
  else {
    const hashedPassword = await bcrypt.hash(password, 12)
    await new User({email, username, password: hashedPassword}).save()
    return res.status(200).json({username})
  }
}

exports.login = async(req, res) => {
  const {username, password} = req.body
  const user = await User.findOne({username}, 'username password')
  if (!user) {
    throw {username: 'User not found', status: 401}
  }
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    throw {password: 'Invalid password', status: 401}
  }
  const userId = user._id.toString()
  const token = jwt.sign(
    {username, userId},
    JWT_SECRET_KEY,
    {expiresIn: '1h'}
  )
  return res.status(200).json({token, userId})
}