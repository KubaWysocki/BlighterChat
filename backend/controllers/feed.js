const {pageSizes} = require('../util/constants')
const isLastPage = require('../util/isLastPage')

exports.getFeed = async(req, res) => {
  const {page = 0} = req.params
  const total = req.user.chats.length
  await req.user.execPopulate({
    path: 'chats',
    select: '-_id -__v',
    populate: [{
      path: 'messages',
      select: '-_id -__v',
      options: {sort: '-timestamp'},
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
    }],
    options: {
      sort: '-updatedAt',
      skip: Number(page) * pageSizes.FEED,
      limit: pageSizes.FEED
    },
  })
  res.status(200).json({
    content: req.user.chats,
    isLast: isLastPage(total, page, pageSizes.FEED)
  })
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