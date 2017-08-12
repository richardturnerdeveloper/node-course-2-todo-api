var mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: this._id, access}, 'abc123');

  user.tokens.push({access, token});

  return user.save()
    .then(() => {
      return token;
    });
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject('Could not verify this token');
  }
  return User.findOne({
    "_id": decoded._id,
    "tokens.access": 'auth',
    "tokens.token": token
  });
}

UserSchema.pre('save', function(done) {
  var user = this;
  console.log('WPORKING');
  if (user.isModified('password')){
    bcrypt.genSalt(10, user.password, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        done();
      });
    });
  } else {
    done();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}
