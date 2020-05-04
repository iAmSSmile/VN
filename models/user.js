const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', {
  username: {
    type: String,
    match: [/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, "Неверный адрес электронной почты"]
  },
  password: String,
  email: {
    type: String,
    match: [/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/, "Неверный адрес электронной почты"]
  },
  firstName: String,
  lastName: String,
  ip: [String],
  isVerified: Boolean,
  isAdmin: Boolean,
  verify_key: String,
  registration_date: Date
});