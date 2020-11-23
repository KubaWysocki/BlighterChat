exports.getUsers = (req, res, next) => {
  console.log('lol')
  res.status(200).json({
    users: [{name: 'Kuba'}]
  })
}