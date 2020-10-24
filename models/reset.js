const { Schema } = require('mongoose');
const db = require('../config/db');

const Reset = db.model('Reset', {
  hash: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: { type: Date, default: Date.now },
  valid: Boolean,
});

module.exports = Reset;
