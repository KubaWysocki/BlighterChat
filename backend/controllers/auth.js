const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const ApiError = require('../util/ApiError')
const {JWT_SECRET_KEY} = require('../util/constants')

function createToken(_id) {
  return jwt.sign(
    {_id},
    JWT_SECRET_KEY,
    {expiresIn: '48h'},
  )
}

exports.signup = async(req, res) => {
  const {email, username, password} = req.body
  const users = await User.find({email})

  if(users.length) throw new ApiError(404, {email: 'Email already in use'})

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await new User({
    email,
    username,
    password: hashedPassword,
  }).save()

  const token = createToken(user._id.toString())

  res.status(200).json({token, email, username, slug: user.slug})
}

exports.login = async(req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email}, 'username password slug')

  if (!user) throw new ApiError(401, {email: 'Email not found'})

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) throw new ApiError(401, {password: 'Invalid password'})

  const token = createToken(user._id.toString())

  res.status(200).json({token, email, username: user.username, slug: user.slug})
}

exports.autoLogin = async(req, res) => {
  const token = createToken(req.user._id.toString())
  const {email, username, slug} = req.user

  res.status(200).json({token, email, username, slug})
}