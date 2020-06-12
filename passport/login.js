const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');
const bot = require('../bot');
const config = require('config');

module.exports = function (passport) {

  passport.use('login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      // check in mongo if a user with username exists or not
      User.findOne({'username': username},
        function (err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log the error and redirect back
          if (!user) {
            return done(null, false, req.flash('message', 'Неправильный логин или пароль'));
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)) {
            return done(null, false, req.flash('message', 'Неправильный логин или пароль')); // redirect back to login page
          }
          // User and password both match, return user from done method
          // which will be treated like success
          if (process.env.NODE_ENV === "production") bot.telegram.sendMessage(config.get('TopTaxBot.session'),"Пользователь залогинился: " + user.username);
          return done(null, user);
        }
      );
    })
  );

  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  }
};