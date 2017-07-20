const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id ='5970de6d14835eeaf18dcd04';
var userID = '5970e4801bedc2eb986f1646';

if(!ObjectID.isValid(id)){
  console.log('WARNING: !!!ID is not valid!!!!');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos ', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo ', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Todo does not exist');
//   }
//   console.log('Todo By Id ', todo);
// }).catch((e) => {
//   console.log('Error!!!!!!!');
// });

User.findById(userID).then((user) => {
  if(!user){
    return console.log('User does not exist!');
  }
  console.log('User By ID: ', user);
}).catch((e) => {
  console.log(e);
});
