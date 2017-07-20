const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [
  {
    _id: new ObjectID(),
    text: 'Go to bathroom'
  },
  {
    _id: new ObjectID(),
    text: 'Watch TV'
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
   return Todo.insertMany(todos)
 }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should not create a new todo with invalid body data',(done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
});
});

describe('GET /todos tests', () => {
  it('should return a list of the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });
});

describe('/GET /todos/:id TESTS:', () => {
  it('should return a valid id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });
  it('should return a 400 for non-object IDs', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(400)
      .end(done);
  });
  it('should return a 400 if to-do not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(400)
      .end(done);
  });
});
