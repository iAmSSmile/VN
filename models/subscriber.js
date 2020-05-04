const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Subscriber', {
  email: {
    type: String,
    match: [/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, "Неверный адрес электронной почты"]
  }
});
