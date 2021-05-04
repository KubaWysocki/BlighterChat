const expect = require('chai').expect
const sinon = require('sinon')

const mock = require('../../mock')
const {sendFriendRequest} = require('../../../controllers/user')
const ioInstance = require('../../../util/socket')
const User = require('../../../models/User')

describe('sendFriendRequest user controller', function() {
  let usersWhoAreFriends
  let user0SentRequestToUser1
  before(async function() {
    usersWhoAreFriends = await Promise.all([
      mock.User(),
      mock.User(),
    ])
    usersWhoAreFriends[0].friends.push(usersWhoAreFriends[1])
    usersWhoAreFriends[1].friends.push(usersWhoAreFriends[0])
    await Promise.all(usersWhoAreFriends.map(u => u.save()))

    user0SentRequestToUser1 = await Promise.all([
      mock.User(),
      mock.User(),
    ])
    user0SentRequestToUser1[1].friendRequests.push({user: user0SentRequestToUser1[0], notify: true})
    await user0SentRequestToUser1[1].save()
  })

  after(async function() {
    await mock.User.deleteAllUsers()
  })

  it('should throw if friend request already sent by requester', async function() {
    const req = new mock.Request({
      body: {slug: user0SentRequestToUser1[1].slug}
    }, user0SentRequestToUser1[0])

    const res = new mock.Response()

    try {
      await sendFriendRequest(req, res)
      throw {}
    }
    catch (e) {
      expect(e).to.have.property('status').equal(403)
      expect(e).to.have.property('message').equal('Friend request already sent')
    }
  })

  it('should throw if user already in friends', async function() {
    const req = new mock.Request({
      body: {slug: usersWhoAreFriends[0].slug}
    }, usersWhoAreFriends[1])

    const res = new mock.Response()

    try {
      await sendFriendRequest(req, res)
      throw {}
    }
    catch (e) {
      expect(e).to.have.property('status').equal(403)
      expect(e).to.have.property('message').equal('User already in friends')
    }
  })

  it('should throw if friend request already sent by other user', async function() {
    const req = new mock.Request({
      body: {slug: user0SentRequestToUser1[0].slug}
    }, user0SentRequestToUser1[1])

    const res = new mock.Response()

    try {
      await sendFriendRequest(req, res)
      throw {}
    }
    catch (e) {
      expect(e).to.have.property('status').equal(409)
      expect(e).to.have.property('message').equal('User sent request to you before')
    }
  })

  it('should save friend request', async function() {
    const req = new mock.Request({
      body: {slug: user0SentRequestToUser1[0].slug}
    }, usersWhoAreFriends[0])

    const res = new mock.Response()

    const ioStub = sinon.stub(ioInstance, 'getActiveConnection')

    await sendFriendRequest(req, res)

    ioStub.reset()

    const target = await User.findOne({_id: user0SentRequestToUser1[0]._id}) //reload from db

    expect(res.status.calledOnceWithExactly(200)).to.be.true
    expect(res.json.firstCall.args[0].isFriendRequestSent).to.equal(true)
    expect(target.friendRequests).to.have.lengthOf(1)
    expect(target.friendRequests[0].user._id.equals(usersWhoAreFriends[0]._id)).to.be.true
  })
})