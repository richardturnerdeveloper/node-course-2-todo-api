// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to DB');
  }
  db.collection('Users').find({name: 'Travis Turner'}).toArray().then((docs) => {
    console.log('Matching users: ');
    console.log(JSON.stringify(docs,undefined,2));;
  },
(err) => {
  console.log('Error', err);
});
  db.collection('Users').count().then((count) => {
    console.log(`Number found: ${count}`);
  }, (err) => {
    console.log('Error', err);
  });
  // db.close();
});
