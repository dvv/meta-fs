var Fs = require('../')
var Path = require('path')
var assert  = require('assert').ok

require('vows').describe('find').addBatch({
  'is sane:': {
    topic: function () {
      var next = this.callback
      var r = {
        total: 0,
        count: 0,
        dirs: 0,
        dirs_by_stat: 0,
      }
      Fs.find('node_modules', {
        match_fn: function (path, stat, depth, cb) {
          r.total++
          if (path.match(/\.js$/)) {
            r.count++
          }
          if (stat.isDirectory()) {
            r.dirs_by_stat++
          }
          cb()
        },
        dir_fn: function (path, stat, depth, cb) {
          r.dirs++
          cb()
        }
      }, function(err) {
        next(err, r)
      })
    },
    'counts right all files in dependencies': function (err, result) {
      assert(!err)
      assert(result.total === 152)
    },
    'counts right all *.js files in dependencies': function (err, result) {
      assert(!err)
      assert(result.count === 66)
    },
    'counts right all directories in dependencies': function (err, result) {
      assert(!err)
      assert(result.dirs === 46)
      assert(result.dirs_by_stat === 46)
    },
    'behaves like /bin/find': function (err, total) {
      assert('TODO')
    },
  },
}).export(module)
