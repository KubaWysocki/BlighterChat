module.exports = (error, req, res) => {
  console.log(error) //eslint-disable-line
  const {status = 500, message} = error
  res.status(status).json({message})
}