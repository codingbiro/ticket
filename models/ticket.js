const { Schema } = require('mongoose');
const db = require('../config/db');

const Ticket = db.model('Ticket', {
  code: String,
  valid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  _ticketCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TicketCategory',
  },
});

module.exports = Ticket;
