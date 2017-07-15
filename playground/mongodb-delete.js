const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log('Unable to connect to database');
  }
  // db.collection('Todos').deleteMany({todo: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Todos').deleteOne({todo: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Users').deleteMany({name: 'Travis Turner'}).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("596a3be3e1cafcbaf0791d33")
  }).then((result) => {
    console.log(result);
  });
});
