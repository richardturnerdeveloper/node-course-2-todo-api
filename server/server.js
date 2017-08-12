require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", (req,res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get("/todos", (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get("/todos/:id", (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Not a valid ID!')
  }
  Todo.findById(id).then((todo) => {
    if (!todo){
      return res.status(400).send('Todo not found!');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete("/todos/:id", (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('ID not valid');
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.send(404).send('No todo exists');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(404).send(e);
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.post("/users", (req,res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);

  user.save()
    .then((user) => {
    return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((e) => {
    res.status(400).send(e);
    });
});

app.get("/users", (req, res) => {
  User.find().then((users) => {
    res.status(200).send(users);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get("/users/me", authenticate, (req, res) => {
  var user = req.user;
  res.send(user);
});



app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

module.exports = {
  app
};
