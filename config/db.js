require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.NODE_ENV ? `mongodb://localhost:27017/${process.env.MONGO_DB}` : 'mongodb://localhost:27017/ticket';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
// mongoose.set('debug', true);

module.exports = mongoose;
