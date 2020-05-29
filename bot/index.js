const Telegraf = require('telegraf');
// const LocalSession = require('telegraf-session-local');
const config = require('config');
const Subscriber = require('../models/subscriber');

const bot = new Telegraf(config.get('TopTaxBot.secret'));
// bot.use((new LocalSession({ database: './sessions/bot.json' })).middleware());

bot.command('subscribers', (ctx) => {
  Subscriber.find({}, 'email date', (err, subscribers) => {
    ctx.reply(subscribers.toString());
  });
});

module.exports = bot;