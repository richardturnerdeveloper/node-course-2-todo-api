var {SHA256} = require("crypto-js");
var jwt = require('jsonwebtoken');

var message = 'Hello I am the Cat Man';

// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`HASH: ${hash}`);

var data = {
  id: 4
};
var token = jwt.sign(data,'HELLO');
console.log(token);
console.log(jwt.verify(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNTAxMTA4NjgyfQ.BdL2VGngEtfrCvH4pYENXnVyyIAd6qrPK3jY9sIAX7w,'HELLO'));
