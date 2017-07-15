const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err){
    return console.log('Could not connect to database');
  }
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("596a533f9b874412b64584a4")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // },
  //   {
  //     returnOriginal: false
  //   }
  // ).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("596a3be9678874baf1f71028")},
    {$set: {name: 'Travis'}},
    {returnOriginal: false}).then((result) => {
      console.log(result);
    });
    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID("596a3be9678874baf1f71028")},
      {$inc: {age: 1}},
      {returnOriginal: false}).then((result) => {
        console.log(result);
      });
});
