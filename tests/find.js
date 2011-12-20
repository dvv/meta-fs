var Fs = require('../')
var Path = require('path')
//var suite = require('vows').describe
var ok  = require('assert').ok
var equal  = require('assert').equal

//suite('find').addBatch({
require('vows').describe('find')
.addBatch({
  'is sane:': {
    topic: function () {
      var next = this.callback
      var r = {
        total: 0,
        count: 0,
        dirs: 0,
        dirs_by_stat: 0,
      }
      Fs.find('sandbox', {
        match_fn: function (path, stat, depth, cb) {
          r.total++
          if (path.match(/\.lua$/)) {
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
    'counts right all files': function (err, result) {
      ok(!err)
      equal(result.total, 27)
    },
    'counts right all *.js files': function (err, result) {
      ok(!err)
      equal(result.count, 11)
    },
    'counts right all directories': function (err, result) {
      ok(!err)
      equal(result.dirs, 9)
      equal(result.dirs_by_stat, 9)
    },
    'behaves like /bin/find': function (err, total) {
      ok('TODO')
    },
  },
})
.export(module)
