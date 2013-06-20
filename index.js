/**
 * Module dependencies
 */
var pbkdf2 = require("crypto").pbkdf2;

module.exports = function(options) {
  return function(app) {
    app.verifyPassword(function(user, password, done) {
      pbkdf2(password, options.salt, options.iterations, options.keylen, function(err, hash) {
        if (err) return done(err);

        var passhash = new Buffer(user.passhash, 'hex');

        done(null, safeCompare(hash, passhash));
      });
    });
  };
};

function safeCompare(a, b) {
  // things must be the same length to compare them.
  if (a.length != b.length) return false;

  // constant-time compare
  //   hat-tip to https://github.com/freewil/scmp for |=
  var same = 0;
  for (var i = 0; i < a.length; i++) {
    same |= a[i] ^ b[i];
  }
  return same === 0;
};
