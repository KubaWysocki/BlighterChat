const sinon = require('sinon')
const expect = require('chai').expect

const mock = require('../mocks')
const errorHandler = require('../../middleware/errorHandler')

describe('errorHandler middleware', function() {
  let logStub
  before(function() {
    logStub = sinon.stub(console, 'log')
  })

  let res
  beforeEach(function() {
    res = new mock.Response()
  })

  after(function() {
    sinon.restore()
  })

  it('should log error to the console and set default status code', function() {
    errorHandler({}, {}, res, () => null)

    expect(logStub.calledOnce).to.be.true
    expect(res.status.calledOnceWithExactly(500)).to.be.true
  })

  it('should set status code and message if given', function() {
    const message = 'probably some descriptive message'
    errorHandler({status: 400, message}, {}, res, () => null)

    expect(res.status.calledOnceWithExactly(400)).to.be.true
    expect(res.json.calledOnceWithExactly({message})).to.be.true
  })

  it('should call next', function() {
    const spy = sinon.spy()
    errorHandler({}, {}, res, spy)

    expect(spy.calledOnce).to.be.true
  })
})