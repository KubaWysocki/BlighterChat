const {pageSizes} = require('../util/constants')
const isLastPage = require('../util/isLastPage')

exports.getFeed = async(req, res) => {
  const {page} = req.params
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
        select: '-__v -_id -chats -friendRequests -friends -emaile'
      },
      {
        path: 'readList',
        select: '-__v -_id -chats -friendRequests -friends -email'
      }]
    },
    {
      path: 'users',
      select: '-__v -_id -chats -friendRequests -friends -email'
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
    populate: [{
      path: 'messages',
      select: '-_id -__v',
      match: {
        readList: {
          $ne: req.user._id
        }
      }
    },
    {
      path: 'users',
      select: '-__v -_id -chats -friendRequests -friends -email',
    }]
  })
  const result = {}
  req.user.chats.forEach(chat => chat.messages.length && (result[chat.slug] = chat))

  res.status(200).json(result)
}