const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const {modelNames} = require('../util/constants')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  friendRequests: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  friends: [{
    type: Schema.Types.ObjectId, ref: modelNames.USER
  }],
  chats: [{
    type: Schema.Types.ObjectId, ref: modelNames.CHAT
  }],
  lastActivity: {
    type: Date,
    required: true
  }
})

userSchema.plugin(URLSlugs('username'))


userSchema.methods.addFriend = function() {

}

module.exports = mongoose.model(modelNames.USER, userSchema)