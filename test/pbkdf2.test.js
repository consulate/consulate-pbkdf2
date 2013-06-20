/**
 * Module dependencies
 */
var should = require('should')
  , pbkdf2 = require('..');

/**
 * Passwords
 */
var SALT = 'here is some a salt'
  , TESTING123_PASSWORD = '65a6e8beae978972054fd241d3ae644f1d62daa9ddcfeadd78ae0121a6a2f6aae4330a76376162868d21524e4ccc0d8d3dc5a6c21bb14b8b037d6e7b5ca093a1'
  , USER_TESTING123_PASSWORD = 'b73a67d552894e7506f23c428b86384e5983ae7c81c861ed088a7f91bead21ccd930e10b1cbc28ccf9a5c17ca923d084ac9f6e8cd3f33bc8bd24f8fea0d3b5ba';

describe('consulate-pbkdf2', function() {

  var app;

  beforeEach(function() {
    app = {
      'verifyPassword': function(fn) {
        app.callbacks.verifyPassword = fn;
      },
      callbacks: {}
    };
  });

  it('should register a `verifyPassword` callback', function() {
    var options = {salt: SALT}
      , instance = pbkdf2(options);

    instance(app);

    should.exist(app.callbacks.verifyPassword);
    Object.keys(app.callbacks).should.have.length(1);
  });

  it('should not accept an incorrect password', function(done) {
    var instance = pbkdf2({salt: SALT})(app);

    app.callbacks.verifyPassword({passhash: TESTING123_PASSWORD}, 'testing', function(err, isValid) {
      should.not.exist(err);
      should.exist(isValid);
      isValid.should.be.false;
      done();
    });
  });

  it('should accept a correct password', function(done) {
    var instance = pbkdf2({salt: SALT})(app);

    app.callbacks.verifyPassword({passhash: TESTING123_PASSWORD}, 'testing123', function(err, isValid) {
      should.not.exist(err);
      should.exist(isValid);
      isValid.should.be.true;
      done();
    });
  });

  it('should use a user stored salt', function(done) {
    var instance = pbkdf2({salt: SALT})(app)
      , user = {passhash: USER_TESTING123_PASSWORD, salt: 'this is a user salt'};

    app.callbacks.verifyPassword(user, 'testing123', function(err, isValid) {
      should.not.exist(err);
      should.exist(isValid);
      isValid.should.be.true;
      done();
    });
  });
});
