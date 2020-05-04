const Declaration = require('../models/declaration');
// const User = require('../models/user');
// const yandexCheckout = require('yandex-checkout')('668325', 'test_kegkkoAdpmtGFGGbxPqT6hRE30YRGs3HbkpJgjYlq1w');
const yandexCheckout = require('yandex-checkout')('661538', 'live_-sdL1PzU6wmowqKqaBh8pJTYFwtQd00iIITVryKIJmo');
const cryptoRandomString = require('crypto-random-string');
const axios = require('axios');
const moment = require('moment');

exports.buy_declaration = function (req, res, next) {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    if (declaration.payment && declaration.payment.status === "succeeded") {
      res.redirect('/declaration/' + declaration._id + '/generate');
    } else if (!declaration.FULLNESS.length) {
      // let idempotence_key = declaration.idempotence_key || cryptoRandomString({length: 10, type: 'url-safe'});
      yandexCheckout.createPayment({
        'amount': {
          'value': '100.00',
          'currency': 'RUB',
        },
        'description': 'Генерация декларации 3-НДФЛ за ' + declaration.year + 'г. для ' + req.user.username,
        'confirmation': {
          'type': 'redirect',
          'return_url': `https://top-tax.ru/declarations`,
        },
        'capture': true,
        'metadata': {
          'user': req.user.username,
          'declaration': declaration._id
        }
        // }, idempotence_key)
      })
      .then((result) => {
        declaration.payment = result;
        // declaration.idempotence_key = idempotence_key;
        declaration.save((err, doc) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect(declaration.payment.confirmation.confirmation_url);
          }
        })
      })
      .catch(err => console.log(err));
    }
  });
};

exports.payment_status = function (req, res, next) {
  // console.log("POST payment_status\n");
  Declaration.findOne({'_id': req.body.object.metadata.declaration}, (err, declaration) => {
    if (req.body.object.status === "canceled") {
      declaration.payment = "";
      declaration.idempotence_key = "";
    }
    if (req.body.object.status === "succeeded") {
      declaration.payment = req.body.object;
      generateCheck(declaration._id);
    }
    declaration.save((err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  });
  res.status(200).end();
};

function generateCheck(declarationID) {
  // console.log("CALL generateCheck\n");
  Declaration.findOne({'_id': declarationID}, (err, declaration) => {
    if (err) {
      console.log(err);
    } else {
      let data = {
        'id': cryptoRandomString({length: 32, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890'}),
        "doc_type": "sale",
        // "timestamp_utc": moment(Date.now()).unix(),
        "timestamp_utc": moment(declaration.payment.captured_at).unix(),
        "timestamp_local": moment(declaration.payment.captured_at).unix(),
        "email": declaration.payment.metadata.user,
        "phone": declaration.phone.replace(/[^\d+]/g, ''),
        "tax_system": "USN",
        "call_back_uri": "https://top-tax.ru/check_status",
        "inn": "2130214381",
        "payment_address": "top-tax.ru",
        "items": [{
          "name": declaration.payment.description,
          "price": 100,
          "quantity": 1,
          "sum": 100,
          "tax": "vat0",
          "tax_sum": 0,
          "sign_method_calculation": "full_prepayment",
          "sign_calculation_object": "service"
        }],
        "credit": 0,
        "advance_payment": 0,
        "total": 100
      };
      // console.log('CHECK:\n' + JSON.stringify(data));
      axios.post('https://kkm.rarus-cloud.ru/v1/document', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'API-KEY': `29436ACAADC24967B8BD2DF022BE0161`
        }
      }).then((response) => {
        // console.log(JSON.stringify(response));
      })
    }
  })
}

exports.check_status = function (req, res, next) {
  // console.log("POST check_status\n");
  console.log(JSON.stringify(req.body));
  res.status(200).end();
};