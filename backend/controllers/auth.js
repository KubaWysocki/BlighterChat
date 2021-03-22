const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {AUTH_EXPIRATION_TIME} = require('../util/constants')
const User = require('../models/User')
const ApiError = require('../util/ApiError')

const COOKIE_OPTIONS = {maxAge: AUTH_EXPIRATION_TIME, httpOnly: true}

function createToken(_id) {
  return jwt.sign(
    {_id},
    process.env.TOKEN_SECRET,
    {expiresIn: AUTH_EXPIRATION_TIME},
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
  res.cookie('JWT', token, COOKIE_OPTIONS)

  res.status(201).json({email, username, slug: user.slug})
}

exports.login = async(req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email}, 'username password slug')

  if (!user) throw new ApiError(401, {email: 'Email not found'})

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) throw new ApiError(401, {password: 'Invalid password'})

  const token = createToken(user._id.toString())
  res.cookie('JWT', token, COOKIE_OPTIONS)

  res.status(202).json({email, username: user.username, slug: user.slug})
}

exports.autoLogin = async(req, res) => {
  const token = createToken(req.user._id.toString())
  res.cookie('JWT', token, COOKIE_OPTIONS)

  const {email, username, slug} = req.user

  res.status(202).json({email, username, slug})
}

exports.logout = (req, res) => {
  res.clearCookie('JWT')
  res.status(205).json({})
}