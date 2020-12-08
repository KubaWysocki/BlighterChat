const User = require('../models/User')


exports.getUsers = async() => {

}

exports.getProfile = async(req, res) => {
  const username = req.params.user
  const user = await User.findOne({username})
  if (!user) throw new Error('User not found')
  return res.status(200).json(user)
}