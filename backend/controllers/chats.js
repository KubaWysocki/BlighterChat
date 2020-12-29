const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const ApiError = require('../util/ApiError')
const ioInstance = require('../util/socket')

exports.getChat = async(req, res) => {
  const {slug} = req.params

  const {receiver} = req.query
  let recipient
  if (receiver) recipient = await User.findOne({slug: receiver})

  await req.user.execPopulate({
    path: 'chats',
    select: '-__v -_id',
    match: {
      $or: [
        {slug},
        {
          users: {
            $size: 2,
            $all: [req.user._id, recipient?._id]
          }
        }
      ]
    }
  })

  const chat = req.user.chats[0]
  if (!chat) return res.status(200).json({newChat: true})

  await chat.getMessages()
  await chat.execPopulate('users', '-__v -_id -chats -friendRequests -friends -email')
  delete chat._doc._id
  delete chat._doc.__v

  res.status(200).json(chat)
}

exports.createChat = async(req, res) => {
  const {chatName, slugs, content} = req.body
  if (!content) throw ApiError(401, 'Message can not be empty')

  const receivers = slugs?.length && await User.find({slug: {$in: slugs}})
  if(!receivers?.length) throw ApiError(404, 'Recivers not found')

  const isGroupChat = receivers.length > 1
  if (!isGroupChat) {
    const existingChat = await Chat.findOne({
      users: {
        $size: 2,
        $all: [req.user._id, receivers[0]]
      }
    })
    if (existingChat) throw ApiError(404, 'You can not create second private chat with the same user')
  }
  else if (!chatName) {
    throw ApiError(404, 'Group chats have to have a name')
  }

  const message = new Message({user: req.user._id, content})
  await message.save()
  const allChatUsers = receivers.concat(req.user)
  const chat = await new Chat({
    name: isGroupChat ? chatName : `${req.user.slug}-${receivers[0].slug}`,
    users: allChatUsers,
    messages: [message._id]
  }).save()

  await User.updateMany(
    {_id: {$in: allChatUsers}},
    {$push: {chats: chat}}
  )

  await chat.getMessages()
  delete chat._doc._id
  delete chat._doc.__v

  await message.execPopulate('user', '-__v -_id -chats -friendRequests -friends -email')
  delete message._doc._id
  delete message._doc.__v

  ioInstance.get().to(chat.slug).emit('chat-message', {chatSlug: chat.slug, message})

  res.status(200).json(chat)
}

exports.postMessage = async(req, res) => {
  const {chatSlug, content} = req.body
  if (!content) throw ApiError(401, 'Message can not be empty')

  let chat
  if (chatSlug) {
    await req.user.execPopulate({
      path: 'chats',
      match: {slug: chatSlug}
    })
    chat = req.user.chats[0]
  }
  if (!chat) throw new ApiError(401, 'Chat not found')

  const message = await new Message({user: req.user._id, content}).save()
  chat.messages.unshift(message)
  await chat.save()

  await message.execPopulate('user', '-__v -_id -chats -friendRequests -friends -email')
  delete message._doc._id
  delete message._doc.__v

  ioInstance.get().to(chat.slug).emit('chat-message', {chatSlug, message})

  res.status(200).json({slug: chat.slug})
}