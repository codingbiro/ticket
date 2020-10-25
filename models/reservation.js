const { Schema } = require('mongoose');
const db = require('../config/db');

const Reservation = db.model('Reservation', {
  valid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _ticket: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = Reservation;
