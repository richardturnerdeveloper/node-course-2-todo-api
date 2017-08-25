const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const UserOneId = new ObjectID();
const UserTwoId = new ObjectID();

const users = [
  {
    _id: UserOneId,
    email: 'Travis@example.com',
    password: 'user1pass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: UserOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: UserTwoId,
    email: 'Riddo@admin.org',
    password: 'user2pass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: UserTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'Go to bathroom',
    _creator: UserOneId
  },
  {
    _id: new ObjectID(),
    text: 'Watch TV',
    completed: true,
    completedAt: 333,
    _creator: UserTwoId
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
   return Todo.insertMany(todos)
 }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      var user1 = new User(users[0]).save();
      var user2 = new User(users[1]).save();

      return Promise.all([user1, user2]);
    })
    .then(() => {
      done();
    });
}

module.exports = {todos, populateTodos, users, populateUsers};
