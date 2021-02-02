const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const isAuth = require('../../middleware/isAuth')
const User = require('../../models/User')

describe('isAuth middleware', function() {
  let user

  before(async function() {
    user = await new User({
      email: 'test@test.com',
      username: 'test',
      password: 'password',
    }).save()
  })

  after(function() {
    return User.deleteMany({})
  })

  afterEach(function() {
    sinon.restore()
  })

  it('should throw error if no auth cookie is present', async function() {
    const req = {
      cookies: {}
    }
    try {
      await isAuth(req, {}, () => null)
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'Not authenticated')
    }
  })

  it('should throw error if auth cookie is invalid', async function() {
    const req = {
      cookies: {JWT: 'invalid cookie for sure'}
    }
    try {
      await isAuth(req, {}, () => null)
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'Not authenticated')
    }
  })

  it('should throw error if there is no user', async function() {
    const req = {
      cookies: {JWT: 'somehow valid token for unexisting user'}
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({_id: '507f191e810c19729de860ea'}) //fake but valid mongodb _id

    try {
      await isAuth(req, {}, () => null)
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'User not found')
    }
  })

  it('should attach user to request', async function() {
    const req = {
      cookies: {JWT: 'lets say it is valid'}
    }
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({_id: user._id})

    await isAuth(req, {}, () => null)
    expect(req).to.have.property('user')
    expect(req.user._id.toString()).to.equal(user._id.toString())
  })
})