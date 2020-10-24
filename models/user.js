const { Schema } = require('mongoose');
const db = require('../config/db');

const User = db.model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  company: String,
  _tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
});

module.exports = User;
