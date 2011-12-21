var Fs = require('../')
var Path = require('path')
var ok  = require('assert').ok
var equal  = require('assert').equal

require('vows').describe('rm_rf')
.addBatch({
  'rm -rf sandbox/foo/bar:': {
    topic: function () {
      Fs.rm_rf('sandbox/foo/bar', this.callback)
    },
    'purges part of sandbox': function (err) {
      ok(!err)
      ok(!Path.existsSync('sandbox/foo/bar'))
      ok(Path.existsSync('sandbox/foo/link'))
    },
    'rm -rf sandbox:': {
      topic: function () {
        Fs.rm_rf('sandbox', this.callback)
      },
      'purges sandbox': function (err) {
        ok(!err)
        ok(!Path.existsSync('sandbox'))
      },
    },
  },
})
.export(module)
