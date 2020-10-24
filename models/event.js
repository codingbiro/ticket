const db = require('../config/db');

const Event = db.model('Event', {
  img: String,
  title: String,
  desc: String,
  price: String,
  date: Date,
  disabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  _tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
});

module.exports = Event;
