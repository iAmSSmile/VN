const Subscriber = require('../models/subscriber');

module.exports = function (req, res, next) {
  Subscriber.findOne({email: req.body.email}, (err, subscriber) => {
    if (err) {
      res.json({"message": 'Произошла ошибка при сохранении адреса в списке рассылки'});
    }
    if (subscriber) {
      res.json({"message": 'Этот электронный адрес уже есть в списке рассылки'});
    } else {
      let newSubscriber = new Subscriber();
      newSubscriber.email = req.body.email;
      newSubscriber.save(function (err) {
        if (err) {
          res.json({"message": 'Неправильный адрес электронной почты'});
        } else {
          res.json({"message": 'Поздравляем! Мы будем своевременно оповещать вас о появлении новых функций на нашем сайте'});
        }
      });
    }
  })
};