const moment = require('moment');
const Telegraf = require('telegraf');
const config = require('config');
const Subscriber = require('../models/subscriber');
const User = require('../models/user');
const Extra = require('telegraf/extra');

const bot = new Telegraf(config.get('TopTaxBot.secret'));

bot.command('subscribers', (ctx) => {
  Subscriber.find({}, 'email date', (err, subscribers) => {
    let strings = subscribers.reduce((sum, subscriber) => {
      return sum += `*${subscriber.email}*${subscriber.date ? ", " + moment(subscriber.date).format("LL, HH:mm") : ", нет даты"}\n`;
    }, "");
    let result = `Подписались на новости:\n\n${strings}\nВсего: ${subscribers.length}`;
    ctx.reply(result, Extra.markdown());
  });
});

bot.command('users', (ctx) => {
  User.find({}, 'email isVerified registration_date', (err, users) => {
    let strings = users.reduce((sum, user) => {
      return sum += `*${user.email}*, ${user.isVerified ? "подтвержден" : "не подтвержден"}${user.registration_date ? ", " + moment(user.registration_date).format("LL, HH:mm") : ", нет даты"}\n`;
    }, "");
    let result = `Зарегистрированные пользователи:\n\n${strings}\nВсего: ${users.length}`;
    ctx.reply(result, Extra.markdown());
  });
});

module.exports = bot;