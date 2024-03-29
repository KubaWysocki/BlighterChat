const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const ApiError = require('../util/ApiError')
const ioInstance = require('../util/socket')
const {pageSizes} = require('../util/constants')
const isLastPage = require('../util/isLastPage')

exports.getChat = async(req, res) => {
  const {slug} = req.params
  let {receiver} = req.query

  if (receiver) receiver = await User.findOne({slug: receiver})

  await req.user.populate({
    path: 'chats',
    select: '-__v -_id',
    match: {
      $or: [
        {slug},
        {
          users: {
            $size: 2,
            $all: [req.user._id, receiver?._id]
          }
        }
      ]
    }
  })

  const chat = req.user.chats[0]
  if (!chat) return res.status(200).json({newChat: true})

  await chat.getMessages(req.user._id, 0)
  await chat.populate('users', '-__v -_id -chats -friendRequests -friends -email')
  delete chat._doc._id
  delete chat._doc.__v

  res.status(200).json(chat)
}

exports.createChat = async(req, res) => {
  const {chatName, slugs, content} = req.body
  if (slugs.length === 1 && !content) throw ApiError(406, 'Message can not be empty')

  const receivers = slugs?.length && await User.find({
    _id: {$in: req.user.friends},
    slug: {$in: slugs}
  })
  if(!receivers?.length) throw ApiError(404, 'Recivers not found')

  const isGroupChat = receivers.length > 1
  if (!isGroupChat) {
    const existingChat = await Chat.findOne({
      users: {
        $size: 2,
        $all: [req.user._id, receivers[0]]
      }
    })
    if (existingChat) throw new ApiError(406, 'You can not create second private chat with the same user')
  }
  else if (!chatName) {
    throw ApiError(406, 'Group chats have to have a name')
  }

  let message
  if (content) message = new Message({user: req.user._id, content})
  else message = new Message({content: 'Chat created'})
  await message.save()

  const allChatUsers = receivers.concat(req.user)
  const chat = await new Chat({
    name: isGroupChat ? chatName : `${req.user.slug}~${receivers[0].slug}`,
    users: allChatUsers,
    messages: [message]
  }).save()

  await User.updateMany(
    {_id: {$in: allChatUsers}},
    {$push: {chats: chat}}
  )

  delete chat._doc._id
  delete chat._doc.__v

  await message.populate([{
    path: 'user',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }, {
    path: 'readList',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }])

  delete message._doc.__v

  chat.users.forEach(user => {
    ioInstance.getActiveConnection(user, (io, [connection, socket]) => { //eslint-disable-line no-unused-vars
      socket.join(chat.slug)
    })
  })

  ioInstance.get().to(chat.slug).emit('chat-message', chat._doc)

  res.status(201).json(chat)
}

exports.getMoreMessages = async(req, res) => {
  const {slug, page} = req.params
  await req.user.populate({
    path: 'chats',
    select: '-__v -_id',
    match: {slug},
  })
  const chat = req.user.chats[0]
  if (!chat) throw new ApiError(404, 'Can\'t load more messages for not existing chat')
  const total = chat.messages.length
  await chat.getMessages(req.user._id, page)
  res.status(200).json({
    content: chat.messages,
    isLast: isLastPage(total, page, pageSizes.MESSAGES)
  })
}

exports.postMessage = async(req, res) => {
  const {chatSlug, content} = req.body
  if (!content) throw ApiError(406, 'Message can not be empty')

  let chat
  if (chatSlug) {
    await req.user.populate({
      path: 'chats',
      match: {slug: chatSlug}
    })
    chat = req.user.chats[0]
  }
  if (!chat) throw new ApiError(404, 'Chat not found')
  if (chat.blocked) throw new ApiError(409, 'Chat is blocked')

  const message = await new Message({user: req.user._id, content}).save()
  chat.messages.unshift(message)
  await chat.save()

  await message.populate([{
    path: 'user',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }, {
    path: 'readList',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }])
  delete message._doc.__v

  await chat.populate({
    path: 'users',
    select: '-__v -_id -chats -friendRequests -friends -email'
  })

  delete chat._doc._id
  delete chat._doc.__v

  ioInstance.get().to(chat.slug).emit('chat-message', {...chat._doc, messages: [message]})

  res.status(200).json({slug: chat.slug})
}

exports.messageRead = async(req, res) => {
  const {_id, chatSlug} = req.body

  await req.user.populate({
    path: 'chats',
    match: {slug: chatSlug},
    populate: {
      path: 'messages',
      match: {_id}
    }
  })

  let message = req.user.chats[0].messages[0]

  if (!message) throw new ApiError(400, 'Chat or message not found')

  message = await Message.findOneAndUpdate(
    {
      _id,
      user: {$ne: req.user._id}
    },
    {$addToSet: {readList: req.user._id}},
    {new: true}
  )

  await message.populate([{
    path: 'user',
    select: '-__v -_id -chats -friendRequests -friends -email'
  },
  {
    path: 'readList',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }])

  ioInstance.get().to(chatSlug).emit('message-read', message._doc)

  res.status(200).json({})
}