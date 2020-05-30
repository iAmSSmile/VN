var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "no-reply@top-tax.ru",
    pass: "connect39"
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

module.exports = function (passport) {

  passport.use('signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
      if (process.env.NODE_ENV === "production" && req.recaptcha.error) {
        return done(null, false, req.flash('message', 'Неправильная капча'));
      }
      if(req.body.password.length < 6) {
        return done(null, false, req.flash('message', 'Слишком короткий пароль'));
      }
      if(req.body.password !== req.body.password2) {
        return done(null, false, req.flash('message', 'Введенные пароли не совпадают'));
      }
      findOrCreateUser = function () {
        // find a user in Mongo with provided username
        User.findOne({'username': username}, function (err, user) {
          // In case of any error, return using the done method
          if (err) {
            console.log('Error in SignUp: ' + err);
            return done(err);
          }
          // already exists
          if (user) {
            return done(null, false, req.flash('message', 'Такой пользователь уже существует'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = req.body.email;
            newUser.isVerified = process.env.NODE_ENV !== "production";
            newUser.registration_date = new Date();
            newUser.verify_key = cryptoRandomString({length: 5, characters: 'abcdefghijklmnopqrstuvwxyz0123456789'});

            // save the user
            newUser.save(function (err) {
              if (err) {
                console.log('Error in Saving user: ' + err);
                throw err;
              }

              //Send vrification email
              let message = {
                from: "no-reply@top-tax.ru",
                to: newUser.username,
                subject: "Добро пожаловать на top-tax.ru",
                text: "Plaintext version of the message",
                html: `<p>Здравствуйте, Ваш аккаунт на сайте top-tax.ru был успешно создан.</p>
                  <p>Чтобы активировать ваш аккаунт, пожалуйста, нажмите на ссылку ниже.</p>
                  <a href="https://top-tax.ru/confirm/${newUser._id}/${newUser.verify_key}">ссылка</a>`
              };

              transporter.sendMail(message, (err, info) => {
                if (err) {
                  console.log('Error in sending email: ' + err);
                }
              });

              console.log('User Registration succesful');
              return done(null, newUser);
            });
          }
        });
      };
      // Delay the execution of findOrCreateUser and execute the method
      // in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    })
  );

  // Generates hash using bCrypt
  var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
};