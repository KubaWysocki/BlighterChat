const expect = require('chai').expect

const mock = require('../../mock')
const {getProfile} = require('../../../controllers/user')

describe('getProfile user controller', function() {
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

  it('should return unkown profile', async function() {
    const req = new mock.Request({
      params: {slug: usersWhoAreFriends[0].slug}
    }, user0SentRequestToUser1[0])
    const res = new mock.Response()

    await getProfile(req, res)

    expect(res.status.calledOnceWithExactly(200)).to.be.true
    expect(res.json.firstCall.args[0].slug).to.equal(usersWhoAreFriends[0].slug)
    expect(res.json.firstCall.args[0]._doc.isFriend).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.isFriendRequestSent).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.didUserSendFriendRequest).to.equal(false)
  })

  it('should return friend profile', async function() {
    const req = new mock.Request({
      params: {slug: usersWhoAreFriends[0].slug}
    }, usersWhoAreFriends[1])
    const res = new mock.Response()

    await getProfile(req, res)

    expect(res.status.calledOnceWithExactly(200)).to.be.true
    expect(res.json.firstCall.args[0].slug).to.equal(usersWhoAreFriends[0].slug)
    expect(res.json.firstCall.args[0]._doc.isFriend).to.equal(true)
    expect(res.json.firstCall.args[0]._doc.isFriendRequestSent).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.didUserSendFriendRequest).to.equal(false)
  })

  it('should return profile with information that friend request was sent', async function() {
    const req = new mock.Request({
      params: {slug: user0SentRequestToUser1[1].slug}
    }, user0SentRequestToUser1[0])
    const res = new mock.Response()

    await getProfile(req, res)

    expect(res.status.calledOnceWithExactly(200)).to.be.true
    expect(res.json.firstCall.args[0].slug).to.equal(user0SentRequestToUser1[1].slug)
    expect(res.json.firstCall.args[0]._doc.isFriend).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.isFriendRequestSent).to.equal(true)
    expect(res.json.firstCall.args[0]._doc.didUserSendFriendRequest).to.equal(false)
  })

  it('should return profile of user who sent firend request to profile requester', async function() {
    const req = new mock.Request({
      params: {slug: user0SentRequestToUser1[0].slug}
    }, user0SentRequestToUser1[1])
    const res = new mock.Response()

    await getProfile(req, res)

    expect(res.status.calledOnceWithExactly(200)).to.be.true
    expect(res.json.firstCall.args[0].slug).to.equal(user0SentRequestToUser1[0].slug)
    expect(res.json.firstCall.args[0]._doc.isFriend).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.isFriendRequestSent).to.equal(false)
    expect(res.json.firstCall.args[0]._doc.didUserSendFriendRequest).to.equal(true)
  })

  it('should throw if no user found', async function() {
    const req = new mock.Request({
      params: {slug: 'not existinig slug for sure'}
    }, user0SentRequestToUser1[1])
    const res = new mock.Response()
    try {
      await getProfile(req, res)
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 404)
      expect(e).to.have.property('message').eql('User not found')
    }
  })
})