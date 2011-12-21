var Fs = require('../')
var Path = require('path')
//var suite = require('vows').describe
var ok  = require('assert').ok
var equal  = require('assert').equal

//suite('find').addBatch({
require('vows').describe('cp_a')
.addBatch({
  'cp -a MOD MOD1:': {
    topic: function () {
      Fs.cp_a('sandbox/MOD', 'sandbox/MOD1', this.callback)
    },
    'creates directory MOD1/MOD': function (err) {
      ok(!err)
      ok(Fs.statSync('sandbox/MOD1/MOD').isDirectory())
    },
    'creates file MOD1/MOD/N/n.lua': function (err) {
      ok(!err)
      ok(Fs.statSync('sandbox/MOD1/MOD/N/n.lua').isFile())
    },
    'creates symlink MOD1/MOD/N/modules': function (err) {
      ok(!err)
      ok(Fs.lstatSync('sandbox/MOD1/MOD/N/modules').isSymbolicLink())
    },
    'counters:': {
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
      ' are doubled': function (err, result) {
        ok(!err)
        equal(result.total, 54)
        equal(result.count, 22)
        equal(result.dirs, 18)
        equal(result.dirs_by_stat, 18)
      },
    },
  },
})
.export(module)
