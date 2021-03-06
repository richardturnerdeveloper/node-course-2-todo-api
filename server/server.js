var config = require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();


app.use(bodyParser.json());

app.post("/todos", authenticate, (req,res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get("/todos", authenticate, (req,res) => {
  Todo.find(
      {
        _creator: req.user._id
      })
      .then((todos) => {
        res.send({todos});
      }, (e) => {
        res.status(400).send(e);
      });
});

app.get("/todos/:id", authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Not a valid ID!')
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo){
      return res.status(400).send('Todo not found!');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete("/todos/:id", authenticate, (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('ID not valid');
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      return res.send(404).send('No todo exists');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(404).send(e);
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
  .then((todo) => {
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

//LOGIN route
app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token).send(user);
        })
    })
    .catch((e) => {
      res.status(400).send();
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
});

app.get("/users/me", authenticate, (req, res) => {
  var user = req.user;
  res.send(user);
});



app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});

module.exports = {
  app
};
