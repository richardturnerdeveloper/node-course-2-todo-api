var env = process.env.NODE_ENV || "development";
var port;
// process.env.NODE_ENV ||
if (env === 'development'){
  port = 3000;
  process.env.MONGO_URL = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test'){
  port =  3000;
  process.env.MONGO_URL = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production'){
  port = process.env.PORT;
  process.env.MONGO_URL = "mongodb://admin:password123@ds151008.mlab.com:51008/todoapp";
}

module.exports = {env, port};
