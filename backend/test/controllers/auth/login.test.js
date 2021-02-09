const expect = require('chai').expect
const sinon = require('sinon')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mock = require('../../mocks')
const authController = require('../../../controllers/auth')

describe('login controllers auth', function() {

  let existingUser
  before(async function() {
    sinon.stub(bcrypt, 'compare')
    existingUser = await mock.User()
  })

  after(function() {
    sinon.restore()
    return mock.User.deleteAllUsers()
  })

  it('should create token, set cookie and send response', async function() {
    const req = {
      body: {
        email: existingUser.email,
        password: 'Lets say it is a valid password'
      }
    }
    sinon.stub(jwt, 'sign')
    jwt.sign.returns('token')

    bcrypt.compare.returns(true)

    const res = new mock.Response()
    await authController.login(req, res)

    expect(res.status.calledOnceWithExactly(202)).to.be.true
    expect(res.cookie.calledOnceWith('JWT', 'token')).to.be.true
    expect(res.json.calledOnceWithExactly({
      email: req.body.email,
      username: existingUser.username,
      slug: existingUser.slug
    })).to.be.true
  })

  it('should throw error when there is no user with provided email', async function() {
    const req = {
      body: {}
    }
    try {
      await authController.login(req, {})
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message').eql({email: 'Email not found'})
    }
  })

  it('should throw error when passwords compare fails', async function() {
    const req = {
      body: {
        email: existingUser.email,
        password: 'Not maching password'
      }
    }
    bcrypt.compare.returns(false)

    try {
      await authController.login(req, {})
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 401)
      expect(e).to.have.property('message').eql({password: 'Invalid password'})
    }
  })
})