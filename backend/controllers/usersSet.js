const User = require('../models/User')

const {pageSizes} = require('../util/constants')
const isLastPage = require('../util/isLastPage')

exports.getUsers = async(req, res) => {
  const {page} = req.params
  const {search} = req.query
  const query = {
    username: {
      $regex: `^${search}`,
      $options: 'i'
    },
    _id: {$nin: req.user.friends.concat(req.user._id)}
  }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .sort('username')
      .skip(Number(page) * pageSizes.USERS)
      .limit(pageSizes.USERS)
      .select('-_id username slug'),
  ])

  res.status(200).json({
    content: users,
    isLast: isLastPage(total, page, pageSizes.USERS)
  })
}

exports.getFriends = async(req, res) => {
  const {page} = req.params
  const {search} = req.query
  const query = {
    username: {
      $regex: search ? `^${search}`: '',
      $options: 'i'
    }
  }

  const [total, {friends}] = await Promise.all([
    User.countDocuments({
      ...query,
      _id: {$in: req.user.friends}
    }),
    req.user.populate({
      path: 'friends',
      select: '-_id username slug',
      match: {...query},
      options: {
        sort: 'username',
        skip: Number(page) * pageSizes.USERS,
        limit: pageSizes.USERS,
      },
    }),
  ])

  res.status(200).json({
    content: friends,
    isLast: isLastPage(total, page, pageSizes.USERS)
  })
}

exports.getFriendRequests = async(req, res) => {
  await req.user.getFriendRequests()
  req.user.friendRequests.forEach(r => r.notify = false)
  await req.user.save()

  const requestsList = req.user.friendRequests.map(fr => fr.user)
  res.status(200).json(requestsList)
}