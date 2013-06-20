/**
 * Module dependencies
 */
var pbkdf2 = require('crypto').pbkdf2;

module.exports = function(options) {

  options = options || {};

  var iterations = options.iterations || 64000
    , keylen = options.keylen || 64;

  return function(app) {
    app.verifyPassword(function(user, password, done) {
      var salt = user.salt || options.salt;

      if (!salt) return done(Error('Missing a `salt` for consulate-pbkdf2'));

      pbkdf2(password, salt, iterations, keylen, function(err, hash) {
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