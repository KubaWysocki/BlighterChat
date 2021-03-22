const expect = require('chai').expect
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const isAuth = require('../../middleware/isAuth')
const mock = require('../mock')

describe('isAuth middleware', function() {

  before(function() {
    sinon.stub(jwt, 'verify')
  })

  after(function() {
    sinon.restore()
  })

  it('should throw error if no auth cookie is present', async function() {
    const req = new mock.Request()
    try {
      await isAuth(req, {}, () => null)
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'Not authenticated')
    }
  })

  it('should throw error if auth cookie is invalid', async function() {
    const req = new mock.Request({cookies: {JWT: 'invalid cookie for sure'}})
    try {
      await isAuth(req, {}, () => null)
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'Not authenticated')
    }
  })

  it('should throw error if there is no user', async function() {
    jwt.verify.returns({_id: '507f191e810c19729de860ea'}) //fake but valid mongodb _id

    const req = new mock.Request({cookies: {JWT: 'invalid cookie for sure'}})
    try {
      await isAuth(req, {}, () => null)
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message', 'User not found')
    }
  })

  it('should attach user to request', async function() {
    const user = await mock.User()
    jwt.verify.returns({_id: user._id})

    const req = new mock.Request({cookies: {JWT: 'lets say it is valid'}})
    await isAuth(req, {}, () => null)

    expect(req.user._id.toString()).to.equal(user._id.toString())

    await mock.User.deleteAllUsers()
  })
})