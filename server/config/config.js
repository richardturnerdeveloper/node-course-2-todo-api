var env = process.env.NODE_ENV || "development";


if (env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// // OLD CODE
// if (env === 'development'){
//   process.env.PORT = 3000;
//   process.env.MONGO_URL = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test'){
//   process.env.PORT =  3000;
//   process.env.MONGO_URL = 'mongodb://localhost:27017/TodoAppTest';
// } else if (env === 'production'){
//
//   process.env.MONGO_URL = "mongodb://admin:password123@ds151008.mlab.com:51008/todoapp";
// }
