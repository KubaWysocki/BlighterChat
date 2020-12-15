const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const {JWT_SECRET_KEY} = require('../util/constants')

function createToken(_id) {
  return jwt.sign(
    {_id},
    JWT_SECRET_KEY,
    {expiresIn: '48h'}
  )
}

exports.signup = async(req, res) => {
  const {email, username, password} = req.body
  const users = await User.find({email})

  if(users.length) throw 'Email already in use'

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await new User({
    email,
    username,
    password: hashedPassword,
    lastActivity: Date.now()
  }).save()
  const token = createToken(user._id.toString())
  return res.status(200).json({token, email, username, id: user.id})
}

exports.login = async(req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email}, 'username password')

  if (!user) throw {email: 'Email not found', status: 401}

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) throw {password: 'Invalid password', status: 401}

  const token = createToken(user._id.toString())
  user.lastActivity = Date.now()
  user.save()
  return res.status(200).json({token, email, username: user.username, id: user.id})
}

exports.autoLogin = async(req, res) => {
  const token = createToken(req.user._id.toString())
  req.user.lastActivity = Date.now()
  req.user.save()
  const {email, username, id} = req.user
  return res.status(200).json({token, email, username, id})
}