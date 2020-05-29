const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const bot = require('../bot');
const config = require('config');

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.get('captcha.key'), config.get('captcha.secret'));

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "support@top-tax.ru",
    pass: "nonviable39"
  },
  tls: {
    rejectUnauthorized: false
  }
});

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) {
    User.findOne({'_id': req.user._id}, function (err, user) {
      if (user.isVerified) {
        return next();
      } else {
        res.render('user/email_confirm', {email: req.user.username});
      }
    });
  } else {
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
  }
};

var isAdmin = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findOne({'_id': req.user._id}, function (err, user) {
      if (user.isAdmin) {
        return next();
      } else {
        res.redirect('/');
      }
    })
  }
};

var setCredentials = function (req, res, next) {
  req.body.username = req.body.email.toLowerCase();
  next();
};

module.exports = function (passport) {

  router.get('/', function (req, res) {
    res.render('index', {
      user: req.user,
      cookie_agree: !!req.cookies.cookie_agree
    });
  });

  /*исправляю косяк с //  */
  router.get('//', (req, res) => {
    res.redirect('/');
  });

  /* GET login page. */
  router.get('/login', function (req, res) {
    // Display the Login page with any flash message, if any
    res.render('user/login', {
      message: req.flash('message')
    });
  });

  /* Handle Login POST */
  router.post('/login', setCredentials, passport.authenticate('login', {
    successRedirect: '/declarations',
    failureRedirect: '/login',
    failureFlash: true
  }));

  /* GET Registration Page */
  router.get('/signup', recaptcha.middleware.render, function (req, res) {
    res.render('user/signup', {
      message: req.flash('message'),
      captcha: res.recaptcha
    });
  });

  /* Handle Registration POST */
  router.post('/signup', setCredentials, recaptcha.middleware.verify, passport.authenticate('signup', {
    successRedirect: '/confirmation',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/confirmation', function (req, res) {
    res.render('user/email_confirm');
  });

  router.get('/confirm/:userId/:verifyKey', function (req, res, next) {
    User.findOne({'_id': req.params.userId}, function (err, user) {
      if (user.isVerified) {
        res.redirect('/');
      } else if (user.verify_key === req.params.verifyKey) {
        user.isVerified = true;
        user.registration_date = new Date();
        user.save(function (err) {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          bot.telegram.sendMessage(config.get('TopTaxBot.session'),"Зарегистрировался: " + user.username);
          res.redirect('/');
        });
      } else {
        res.send('неправильный ключ верификации');
      }
    });
  });

  /* Handle Logout */
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  /*Admin*/
  const admin = require('../controllers/admin');
  router.get('/admin/users', isAdmin, admin.users);

  /* GET declarations Page */
  const declaration = require('../controllers/declaration');

  router.get('/declarations', isAuthenticated, declaration.get_declarations);
  router.get('/declaration/new', isAuthenticated, declaration.new_declaration);
  router.get('/declaration/:declarationId/delete', isAuthenticated, declaration.delete_declaration);
  router.get('/declaration/:declarationId/verify', isAuthenticated, declaration.verify_declaration);

  router.get('/declaration/:declarationId/step/:step', isAuthenticated, declaration.get_step);

  router.post('/declaration/:declarationId/step/1', isAuthenticated, declaration.post_step_1);
  router.post('/declaration/:declarationId/step/2', isAuthenticated, declaration.post_step_2);
  router.post('/declaration/:declarationId/step/3', isAuthenticated, declaration.post_step_3);
  router.post('/declaration/:declarationId/step/4', isAuthenticated, declaration.post_step_4);
  router.post('/declaration/:declarationId/step/5', isAuthenticated, declaration.post_step_5);

  const payment = require('../controllers/payment');
  router.get('/declaration/:declarationId/buy', isAuthenticated, payment.buy_declaration);
  router.post('/payment_status', payment.payment_status);
  router.post('/check_status', payment.check_status);

  const pdf = require('../controllers/pdf');
  router.get('/declaration/:declarationId/generate', isAuthenticated, pdf.checkForDownload, pdf.generate);


  /* общие страницы */

  router.get('/user_agreement', (req, res) => {
    res.render('user_agreement', {user: req.user});
  });

  router.get('/confidential', (req, res) => {
    res.render('confidential', {user: req.user});
  });

  router.get('/legal', (req, res) => {
    res.render('legal', {user: req.user});
  });

  router.post('/cookie_agree', (req, res) => {
    res.cookie('cookie_agree', 'true').json({"cookie_agree": 'true'});
  });

  const subscribe = require("../controllers/subscribe");
  router.post('/subscribe', subscribe);

  router.post('/send_mail', (req, res) => {
    let message = {
      from: "support@top-tax.ru",
      to: "support@top-tax.ru",
      replyTo: req.body.email,
      subject: "Письмо от " + req.body.email + " (" + req.body.name + ")",
      text: req.body.topic_text,
      html: req.body.topic_text
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error in sending email: ' + err);
      }
    });
  });

  return router;
};