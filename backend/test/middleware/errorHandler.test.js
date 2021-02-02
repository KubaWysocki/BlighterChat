const sinon = require('sinon')
const expect = require('chai').expect

const errorHandler = require('../../middleware/errorHandler')

describe('errorHandler middleware', function() {
  let stub
  before(function() {
    stub = sinon.stub(console, 'log')
  })

  let res
  beforeEach(function() {
    res = {
      _status: null,
      _data: null,
      status: function(s) {
        this._status = s
        return this
      },
      json: function(d) {
        this._data = d
      }
    }
  })

  after(function() {
    sinon.restore()
  })

  it('should log error to the console and set default status code', function() {
    errorHandler({}, {}, res, () => null)

    expect(stub.calledOnce).to.be.true
    expect(res._status).to.equal(500)
  })

  it('should set status code and message if given', function() {
    errorHandler({status: 400, message: 'probably some descriptive message'}, {}, res, () => null)

    expect(res._status).to.equal(400)
    expect(res._data).to.have.property('message', 'probably some descriptive message')
  })

  it('should call next', function() {
    const spy = sinon.spy()
    errorHandler({}, {}, res, spy)

    expect(spy.calledOnce).to.be.true
  })
})