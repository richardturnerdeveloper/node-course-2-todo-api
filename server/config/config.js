var env = process.env.NODE_ENV || "development";

// process.env.NODE_ENV ||
if (env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGO_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production'){
  process.env.MONGO_URI = "mongodb://admin:password123@ds151008.mlab.com:51008/todoapp";
}
