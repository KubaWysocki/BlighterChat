module.exports = (error, req, res, next) => {
  console.log(error) //eslint-disable-line
  const {status = 500, message, ...rest} = error
  res.status(status).json({message, ...rest})
  next()
}