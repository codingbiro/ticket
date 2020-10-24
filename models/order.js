const { Schema } = require('mongoose');
const db = require('../config/db');

const Order = db.model('Order', {
  start: { type: Date, default: Date.now },
  state: { type: String, enum: ['Prepared', 'Started', 'InProgress', 'Canceled', 'Succeeded', 'Failed', 'Expired', 'Waiting', 'Reserved', 'Authorized', 'PartiallySucceeded'] },
  total: String,
  pid: String,
  title: String,
  desc: String,
  quantity: Number,
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  discharged: { type: Boolean, default: false },
});

module.exports = Order;
