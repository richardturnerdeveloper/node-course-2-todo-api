const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//THREE METHODS FOR DELETING RECORDS
// Todo.remove();
// Can't have an empty argument.  Gets back a result.
// Shows a bunch and the number of items removed.

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove()
// RETURNS the removed document object - can log or return.

// Todo.findByIdAndRemove()
// RETURNS the removed document object - can log or return.

Todo.findByIdAndRemove("59765e932ac54b00e61a02dd").then((todo) => {
  console.log(todo);
});
