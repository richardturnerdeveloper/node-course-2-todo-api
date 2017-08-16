const {User} = require('./../models/user');


var authenticate = function (req, res, next) {
  var token = req.header('x-auth');
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject('Could not find that user');
      }
      req.user = user;
      req.header = token;
      req.token = token;
      next();
    })
    .catch((e) => {
      res.status(401).send();
    });
}

module.exports = {authenticate};
