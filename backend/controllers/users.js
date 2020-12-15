const User = require('../models/User')
const ApiError = require('../util/ApiError')

exports.getProfile = async(req, res) => {
  const {username, id} = req.params
  const user = await User.findOne({username, id}).select('-__v -chats -friends')
  if (!user) throw new ApiError(404, 'User not found')
  user._doc.isFriend = req.user.friends.some(f => user._id.equals(f))
  user._doc.isFriendRequestSent = user.friendRequests.some(r => req.user._id.equals(r))
  user._doc.didUserSendFriendRequest = req.user.friendRequests.some(r => user._id.equals(r))
  delete user._doc.friendRequests
  return res.status(200).json(user)
}

exports.getUsers = async(req, res) => {
  const {search} = req.query
  const users = await User.find({
    username: {
      $regex: search,
      $options: 'i'
    },
    _id: {$nin: req.user.friends.concat(req.user._id)}
  })
  res.status(200).json(users)
}

exports.sendFriendRequest = async(req, res) => {
  const {_id} = req.body
  const newFriend = await User.findOne({_id})

  if(newFriend.friendRequests.some(r => req.user._id.equals(r))) {
    throw new ApiError(403, 'Friend request already sent')
  }
  if(newFriend.friends.some(f => req.user._id.equals(f))) {
    throw new ApiError(403, 'User already in friends')
  }

  newFriend.friendRequests.push(req.user._id)
  await newFriend.save()
  return res.status(200).json({isFriendRequestSent: true})
}