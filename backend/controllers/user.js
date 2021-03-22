const User = require('../models/User')
const ApiError = require('../util/ApiError')
const ioInstance = require('../util/socket')

exports.getProfile = async(req, res) => {
  const {slug} = req.params
  const user = await User.findOne({slug}).select('-__v -chats -friends')

  if (!user) throw new ApiError(404, 'User not found')

  user._doc.isFriend = req.user.friends.some(f => user._id.equals(f._id))
  user._doc.isFriendRequestSent = user.friendRequests.some(r => req.user._id.equals(r.user._id))
  user._doc.didUserSendFriendRequest = req.user.friendRequests.some(r => user._id.equals(r.user._id))
  delete user._doc.friendRequests
  delete user._doc._id

  res.status(200).json(user)
}

exports.sendFriendRequest = async(req, res) => {
  const {slug} = req.body
  const newFriend = await User.findOne({slug})

  if(newFriend.friendRequests.some(r => req.user._id.equals(r))) {
    throw new ApiError(403, 'Friend request already sent')
  }
  if(newFriend.friends.some(f => req.user._id.equals(f))) {
    throw new ApiError(403, 'User already in friends')
  }

  newFriend.friendRequests.push({user: req.user._id, notify: true})
  await newFriend.save()

  ioInstance.getActiveConnection(newFriend, (io, [connection]) => {
    const number = newFriend.friendRequests.filter(fr => fr.notify === true).length
    io.to(connection).emit('friend-request', {friendRequests: number})
  })

  res.status(200).json({isFriendRequestSent: true})
}

exports.getNewFriendRequestsNumber = async(req, res) => {
  const number = req.user.friendRequests.filter(fr => fr.notify === true).length

  res.status(200).json({friendRequests: number})
}

exports.rejectFriendRequest = async(req, res) => {
  const {slug} = req.params
  await req.user.getFriendRequests()
  req.user.friendRequests = req.user.friendRequests.filter(fr => fr.user.slug !== slug)
  await req.user.save()

  res.status(200).json({slug, didUserSendFriendRequest: false})
}

exports.addFriend = async(req, res) => {
  const {slug} = req.body
  const newFriend = await User.findOne({slug}).select('username slug friends')

  newFriend.friends.push(req.user)
  await newFriend.save()
  newFriend._doc.isFriend = true
  newFriend._doc.isFriendRequestSent = false
  newFriend._doc.didUserSendFriendRequest = false

  req.user.friendRequests = req.user.friendRequests.filter(fr => !newFriend._id.equals(fr.user._id))
  req.user.friends.push(newFriend)
  await req.user.save()

  delete newFriend._doc._id
  delete newFriend._doc.__v
  delete newFriend._doc.friends

  res.status(200).json(newFriend)
}

exports.removeFriend = async(req, res) => {
  const {slug} = req.params
  const removedFriend = await User.findOne({slug})

  req.user.friends = req.user.friends.filter(f => !removedFriend._id.equals(f._id))
  await req.user.save()

  removedFriend.friends = removedFriend.friends.filter(f => !req.user._id.equals(f._id))
  await removedFriend.save()

  res.status(200).json({slug, isFriend: false})
}