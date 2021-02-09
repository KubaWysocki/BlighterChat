const expect = require('chai').expect
const sinon = require('sinon')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mock = require('../../mocks')
const authController = require('../../../controllers/auth')
const User = require('../../../models/User')

describe('signup controllers auth', function() {

  before(function() {
    sinon.stub(jwt, 'sign')
    sinon.stub(bcrypt, 'hash')
    jwt.sign.returns('token')
    bcrypt.hash.returns('hashedPassword')
  })

  let res
  beforeEach(function() {
    res = new mock.Response()
  })

  after(function() {
    sinon.restore()
    return User.deleteMany({})
  })

  afterEach(function() {
    sinon.resetHistory()
  })

  it('should create new user', async function() {
    const req = {
      body: {
        email: 'new@email.com',
        username: 'tester',
        password: 'passoword',
      }
    }
    await authController.signup(req, res)

    expect(bcrypt.hash.calledOnce).to.equal(true)
    expect(jwt.sign.calledOnce).to.equal(true)

    let new_user = await User.find({email: req.body.email}).select('password username email slug')
    expect(new_user.length).to.equal(1)
    new_user = new_user[0]

    expect(new_user).to.have.property('password', 'hashedPassword')
    expect(new_user).to.have.property('username', req.body.username)
    expect(new_user).to.have.property('email', req.body.email)

    expect(res.status.calledOnceWithExactly(201)).to.be.true
    expect(res.cookie.calledOnceWith('JWT', 'token')).to.be.true
    expect(res.json.calledOnceWithExactly({
      email: req.body.email,
      username: req.body.username,
      slug: new_user.slug
    })).to.be.true
  })

  it('should slugify username', async function() {
    const req = {
      body: {
        email: 'secondUserWithSameUsernameAsPrevious@email.com',
        username: 'tester',
        password: 'password',
      }
    }

    await authController.signup(req, res)

    const new_user = await User.findOne({email: req.body.email})
    expect(new_user).to.have.property('slug', 'tester-2')
  })

  it('should throw error when trying to create user with existing email', async function() {
    const req = {
      body: {
        email: 'new@email.com', //same as test case 1
      }
    }
    try {
      await authController.signup(req, {})
      throw {}
    }
    catch(e) {
      expect(e).to.have.property('status', 404)
      expect(e).to.have.property('message').eql({email: 'Email already in use'})
    }
  })

  it('should throw error when missing data', async function() {
    const req = {
      body: {}
    }
    try {
      await authController.signup(req, res)
      throw {}
    }
    catch(e) {
      expect(Object.keys(e.errors).length).to.be.greaterThan(0)
    }
  })
})