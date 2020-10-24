const { Schema } = require('mongoose');
const db = require('../config/db');

const TicketCategory = db.model('TicketCategory', {
  title: String,
  desc: String,
  price: Number,
  quantity: Number,
  enabled: {
    type: Boolean,
    default: true,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _ticket: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  _event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
});

module.exports = TicketCategory;
