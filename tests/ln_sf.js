var Fs = require('../')
var Path = require('path')
//var suite = require('vows').describe
var ok  = require('assert').ok
var equal  = require('assert').equal

//suite('ln_sf').addBatch({
require('vows').describe('ln_sf')
.addBatch({
  'works:': {
    topic: function () {
      Fs.ln_sf('/etc/passwd', 'sandbox/passwd', this.callback)
    },
    'symlinks /etc/p': function (err, result) {
      ok(!err)
      equal(Fs.lstatSync('sandbox/p').isSymbolicLink())
    },
    '/etc/p is readable': function (err, result) {
      ok(!err)
      var p = Fs.readFileSync('sandbox/p', 'utf8')
      ok(p.match(/^root:/))
    },
  },
})
.export(module)
