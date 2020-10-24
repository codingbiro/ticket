const db = require('../config/db');

const Ticket = db.model('Ticket', {
  code: String,
  title: String,
  desc: String,
  price: Number,
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
  _event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
});

module.exports = Ticket;
