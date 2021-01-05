
exports.getFeed = async(req, res) => {
  await req.user.execPopulate({
    path: 'chats',
    select: '-_id -__v',
    populate: [{
      path: 'messages',
      select: '-_id -__v',
      sort: {_id: -1},
      perDocumentLimit: 1,
      populate: [{
        path: 'user',
        select: '-_id username'
      },
      {
        path: 'readList',
        select: '-_id username'
      }]
    },
    {
      path: 'users',
      select: '-_id username'
    }]
  })
  res.status(200).json(req.user.chats)
}

exports.notificationsCount = async(req, res) => {
  await req.user.execPopulate({
    path: 'chats',
    select: '-_id -__v',
    populate: {
      path: 'messages',
      select: '-_id -__v',
      match: {
        readList: {
          $ne: req.user._id
        }
      }
    }
  })
  const result = {}
  req.user.chats.forEach(chat => chat.messages.length && (result[chat.slug] = chat.messages.length))
  res.status(200).json(result)
}