const User = require('../models/user');

exports.users = function (req, res, next) {
  User.find({}, (err, users) => {
    res.render('_admin/users', {
      users: users
    })
  })
};