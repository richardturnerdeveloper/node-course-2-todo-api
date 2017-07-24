var express = require('express');
var bodyParser = require('body-parser')


var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
//HEROKU process.env.PORT
const port = 3000;

app.use(bodyParser.json());

app.post("/users", (req,res) => {
  var user = new User({
    email: req.body.email
  });
  user.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

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


app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

module.exports = {
  app
};
