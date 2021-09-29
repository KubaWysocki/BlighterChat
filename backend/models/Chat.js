const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const ioInstance = require('../util/socket')
const Message = require('./Message')
const {modelNames, pageSizes} = require('../util/constants')

const Schema = mongoose.Schema

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: modelNames.MESSAGE
  }],
  blocked: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true})

chatSchema.plugin(
  URLSlugs('name', {generator: (text) =>
    text.toLowerCase().replace(/^[-_~]([^a-z0-9\-_~]+)[-_~]$/g, '')}
  )
)

chatSchema.methods.getMessages = async function(userId, page) {
  const notReadMessages = await Message.find({
    _id: {$in: this.messages},
    user: {$ne: userId},
    readList: {$ne: userId}
  })

  await Message.updateMany(
    {_id: {$in: notReadMessages}},
    {$addToSet: {readList: userId}}
  )

  const messagesPopulate = [{
    path: 'user',
    select: '-__v -_id -chats -friendRequests -friends -email'
  },
  {
    path: 'readList',
    select: '-__v -_id -chats -friendRequests -friends -email'
  }]

  const updatedMessages = await Message.find(
    {_id: {$in: notReadMessages}},
    null,
    {sort: 'timestamp'}
  ).populate(messagesPopulate)

  updatedMessages.forEach((msg) => {
    ioInstance.get().to(this.slug).emit('message-read', msg)
  })

  return this.execPopulate({
    path: 'messages',
    select: '-__v',
    populate: messagesPopulate,
    options: {
      sort: '-timestamp',
      skip: Number(page) * pageSizes.MESSAGES,
      limit: pageSizes.MESSAGES,
    }
  })
}

module.exports = mongoose.model('Chat', chatSchema)