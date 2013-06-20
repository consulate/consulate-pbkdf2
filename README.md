consulate-pbkdf2 [![Build Status](https://travis-ci.org/consulate/consulate-pbkdf2.png?branch=master)](https://travis-ci.org/consulate/consulate-pbkdf2)
================

pbkdf2 password verification plugin for [consulate](https://github.com/consulate/consulate)

Usage
-----

Just register `consulate-pbkdf2` as a plugin with your [consulate](https://github.com/consulate/consulate) server and specify a salt:

```js
var consulate = require('consulate')
  , pbkdf2 = require('consulate-pbkdf2');

var app = consulate();

app.plugin(pbkdf2({
  salt: 'this is my secret salt',
  iterations: 64000, // optional
  keylen: 64 // optional
}));
```

Tests
-----

```sh
$ npm test
```
