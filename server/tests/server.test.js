const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('/DELETE /todos/:id TESTS', () => {
  it('should remove a TODO', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => {
          return done(e);
        });

      });
  });
  it('should return 404 if TODO not found', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if OBJECT ID is INVALID', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('/PATCH todos route tests', () => {
  it('it should updated the todo', (done) => {
    var id = todos[1]._id;
    request(app)
      .patch(`/todos/${id}`)
      .send({text: "Test case", "completed": true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe("Test case");
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('it should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id;
    request(app)
      .patch(`/todos/${id}`)
      .send({text: "Check em", "completed": false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe("Check em");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET users/me', function(){
  it('should return a user if authenticated', function(done){
    request(app)
      .get("/users/me")
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  });
  it('should return a 401 if not authenticated', function(done){
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', function(){
  it('should create a valid user', (done) => {
    var email = 'example@example.com';
    var password = 'helloworld';

    request(app)
      .post("/users")
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err){
          return done(err);
        }
        User.findOne({email})
        .then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => {
          done(e);
        });
      })
  });
  it('should return a validation error if request invalid', (done) => {
    var email = 'frank';
    var password = {1:2};

    request(app)
      .post("/users")
      .send({email, password})
      .expect(400)
      .end(done);
  });
  it('should not create user if email in use', (done) => {
    var email = 'Travis@example.com';
    var password = 'password1';

    request(app)
      .post("/users")
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
describe('/users/login test routes', function(){
  it('should login user and return auth token', function(done){
    request(app)
      .post("/users/login")
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {

        expect(res.headers['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            })
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
  it('should reject invalid login', function(done){
    request(app)
      .post("/users/login")
      .send({email: users[1].email, password: 'goo'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.findById(users[1]._id)
          .then((user) => {
            if(!user){
              return done();
            }
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
});

describe('DELETE /me/token', function(){
  it('should remove auth token on logout', function(done){
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err){
          return done(err);
        }
        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
})
