const { Schema } = require('mongoose');
const db = require('../config/db');

const Event = db.model('Event', {
  img: String,
  title: String,
  desc: String,
  price: String,
  date: Date,
  disabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _ticketCategory: [{
    type: Schema.Types.ObjectId,
    ref: 'TicketCategory',
  }],
});

module.exports = Event;
