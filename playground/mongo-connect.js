const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to DB');
  }
  // db.collection("Todos").insertOne({
  //   todo: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to add item to database');
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });
  db.collection("Users").insertOne({
    name: 'Jen',
    age: 27
  }, (err, result) => {
    if (err){
      console.log('Unable to add item to database');
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });
  db.close();
});
