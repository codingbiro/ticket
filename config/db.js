require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI ='mongodb+srv://cluster0.rehfd.mongodb.net/ticket';
// process.env.NODE_ENV ? `mongodb://localhost:27017/${process.env.MONGO_DB}` : 'mongodb://localhost:27017/ticket';

console.log(MONGODB_URI);

mongoose.connect(MONGODB_URI, { user: 'vince', pass: 'vince', useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

module.exports = mongoose;
