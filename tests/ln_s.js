var Fs = require('../')
var Path = require('path')
//var suite = require('vows').describe
var ok  = require('assert').ok
var equal  = require('assert').equal

//suite('ln_s').addBatch({
require('vows').describe('ln_s')
.addBatch({
  'works:': {
    topic: function () {
      Fs.ln_s('/etc/passwd', 'sandbox/p', this.callback)
    },
    'symlinks /etc/passwd': function (err, result) {
      ok(!err)
      ok(Fs.lstatSync('sandbox/p').isSymbolicLink())
    },
    'sandbox/p is readable': function (err, result) {
      ok(!err)
      var p = Fs.readFileSync('sandbox/p', 'utf8')
      ok(p.match(/^root:/))
    },
    'errors if destination exists:': {
      topic: function () {
        Fs.ln_s('/etc/passwd', 'sandbox/p', this.callback)
      },
      'symlinks /etc/passwd': function (err, result) {
        ok(err)
        equal(err.code, 'EEXIST')
      },
    },
  },
})
.export(module)
