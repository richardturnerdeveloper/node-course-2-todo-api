var mongoose = require('mongoose');
const MONGO_URI = "mongodb://admin:password123@ds151008.mlab.com:51008/todoapp";
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
