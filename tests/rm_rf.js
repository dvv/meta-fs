var Fs = require('../')
var Path = require('path')
//var suite = require('vows').describe
var ok  = require('assert').ok
var equal  = require('assert').equal

//suite('rm_rf').addBatch({
require('vows').describe('rm_rf')
.addBatch({
  'rm -rf sandbox:': {
    topic: function () {
      Fs.rm_rf('sandbox', this.callback)
    },
    'purges sandbox': function (err) {
      ok(!err)
      ok(!Path.existsSync('sandbox'))
    },
  },
})
.export(module)
