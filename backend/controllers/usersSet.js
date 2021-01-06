const User = require('../models/User')
const ioInstance = require('../util/socket')

exports.getUsers = async(req, res) => {
  const {search} = req.query
  const users = await User.find({
    username: {
      $regex: search,
      $options: 'i'
    },
    _id: {$nin: req.user.friends.concat(req.user._id)}
  }).select('-__v -_id -friends -friendRequests -chats')

  res.status(200).json(users)
}

exports.getFriendRequests = async(req, res) => {
  await req.user.getFriendRequests()
  req.user.friendRequests.forEach(r => r.notify = false)
  await req.user.save()

  ioInstance.getActiveConnection(req.user, (io, [connection]) => {
    io.to(connection)
      .emit('friend-request', {friendRequests: 0})
  })

  const requestsList = req.user.friendRequests.map(fr => fr.user)
  res.status(200).json(requestsList)
}

exports.getFriends = async(req, res) => {
  const {search} = req.query
  await req.user.execPopulate({
    path: 'friends',
    select: '-__v -_id -friends -friendRequests -chats',
    match: {
      username: {
        $regex: search || '',
        $options: 'i'
      }
    }
  })
  res.status(200).json(req.user.friends)
}