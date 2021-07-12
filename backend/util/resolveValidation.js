const {validationResult} = require('express-validator')

const ApiError = require('./ApiError')

const resolveValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.formatWith(({msg}) => msg).mapped()
    throw new ApiError(400, message)
  }
  next()
}

module.exports = resolveValidation