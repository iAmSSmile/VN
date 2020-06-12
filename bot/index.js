const moment = require('moment');
const Telegraf = require('telegraf');
const { telegrafThrottler } = require('telegraf-throttler');
const config = require('config');
const Subscriber = require('../models/subscriber');
const User = require('../models/user');
const Extra = require('telegraf/extra');

const bot = new Telegraf(config.get('TopTaxBot.secret'));
const throttler = telegrafThrottler();
bot.use(throttler);

bot.command('subscribers', (ctx) => {
  Subscriber.find({}, 'email date', (err, subscribers) => {
    chunk(subscribers, 20).forEach((subscribers_group, index) => {
      let strings = subscribers_group.reduce((sum, subscriber) => {
        return sum += `*${subscriber.email}*${subscriber.date ? ", " + moment(subscriber.date).format("LL, HH:mm") : ", нет даты"}\n`;
      }, "");
      let result = (index === 0 ? `ПОДПИСАЛИСЬ НА НОВОСТИ (${subscribers.length}):\n\n` : "") + strings;
      ctx.reply(result, Extra.markdown());
    });
  });
});

bot.command('users', (ctx) => {
  User.find({}, 'email isVerified registration_date', (err, users) => {
    chunk(users, 20).forEach((user_group, index) => {
      let strings = user_group.reduce((sum, user) => {
        return sum += `*${user.email}*, ${user.isVerified ? "подтвержден" : "не подтвержден"}${user.registration_date ? ", " + moment(user.registration_date).format("LL, HH:mm") : ", нет даты"}\n`;
      }, "");
      let result = (index === 0 ? `ВСЕ ПОЛЬЗОВАТЕЛИ (${users.length}):\n\n` : "") + strings;
      ctx.reply(result, Extra.markdown());
    });
  });
});

function chunk(array, size) {
  const chunked_arr = [];
  let copied = [...array]; // ES6 destructuring
  const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
  for (let i = 0; i < numOfChild; i++) {
    chunked_arr.push(copied.splice(0, size));
  }
  return chunked_arr;
}

module.exports = bot;