var Fs = require('fs')
var Path = require('path')

/*
 * mimick mkdir -p
 */
function mkdir_p(path, perm, callback) {
  path = Path.resolve(process.cwd(), path)
  Fs.mkdir(path, perm, function(err) {
    if (!err) { callback() ; return }
    if (err.code === 'ENOENT') {
      mkdir_p(Path.dirname(path), perm, function(err) {
        if (err) {
          callback(err)
        } else {
          mkdir_p(path, perm, callback)
        }
      })
    } else if (err.code === 'EEXIST') {
      Fs.stat(path, function(sterr, stat) {
        if (sterr || !stat.isDirectory()) {
          callback(sterr)
        } else if (stat.mode != perm) {
          Fs.chmod(path, perm, callback)
        } else {
          callback()
        }
      })
    } else {
      callback(err)
    }
  })
}

/*
 * mimick find
 */
function find(path, options, callback) {

  // defaults
  options = options || {}
  var match_fn = options.match_fn || function (path, stat, depth, cb) { cb() }
  var dir_fn = options.dir_fn || function (path, stat, depth, cb) { cb() }

  // cache highly used functions
  var normalize = Path.normalize
  var join = Path.join
  var stat = options.follow ? Fs.stat : Fs.lstat
  var readdir = Fs.readdir

  // base path
  var base = Path.resolve(process.cwd(), path)

  // collect seen inodes
  var inos = {}

  // recursive walk helper
  function walk(path, depth, cb) {
    // stat, resolving symlinks
    stat(path, function (err, st) {
      // stat failed? step out.
      if (err) { cb(err) ; return }
      // prevent endless loops in follow mode
      // N.B. this is to cope with symlinks pointing to '.'
      if (options.follow) {
        // inode seen? step out
        var inode = st.ino
        if (inos[inode]) { cb() ; return }
        // mark inode as seen
        inos[inode] = true
      }
      // call matcher
      match_fn(path, st, depth, function (err) {
        // `true` error means stop going deeper
        if (err && err !== true) { cb(err) ; return }
        // path is not directory? we re done.
        if (!st.isDirectory()) { cb() ; return }
        // path is directory. read files
        readdir(path, function (err, files) {
          if (err) { cb(err) ; return }
          // recursively iterate thru files
          var len = files.length
          var i = 0
          function walker() {
            if (i >= len) {
              // notify of directory is processed
              dir_fn(path, st, depth, cb)
            } else {
              walk(join(path, files[i]), depth + 1, walker)
              i = i + 1
            }
          }
          walker()
        })
      })
    })
  }

  // walk the tree
  walk(base, 0, callback)

}

/*
 * mimick rm -fr
 */
function rm_rf(path, callback) {

  // cache highly used functions
  var unlink = Fs.unlink
  var rmdir = Fs.rmdir

  path = Path.resolve(process.cwd(), path)
  find(path, {
    //follow: false,
    match_fn: function(path, stat, depth, cb) {
      if (!stat.isDirectory()) {
        unlink(path, cb)
      } else {
        cb()
      }
    },
    dir_fn: function (path, stat, depth, cb) {
      rmdir(path, cb)
    },
  }, function (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) { err = null }
    callback(err)
  })

}

/*
 * mimick cp -a
 */
function cp_a(src, dst, callback) {

  // cache highly used functions
  var join = Path.join
  var dirname = Path.dirname
  var basename = Path.basename
  var read = Fs.read_file
  var write = Fs.write_file
  var readlink = Fs.readlink
  var symlink = Fs.symlink
  var chmod = Fs.chmod
  var chown = Fs.chown

  // expand paths
  var src_orig = Path.normalize(src)
  src = Path.resolve(process.cwd(), src)
  dst = Path.resolve(process.cwd(), dst)

  // dots are special cases. E.g. cp_a . /foo should copy content of current directory
  // while cp_a ../foo /bar should copy file/directory ../foo as whole
  var skip_len = dirname(src).length + 1
  if (src_orig == '.') {
    skip_len = src.length + 1
  }

  // walk over the source
  find(src, {
    // for each source file
    match_fn: function (path, stat, depth, cb) {
      // compose target path
      var new_path = join(dst, path.substring(skip_len))
      //print('?'..path)
      //print('!'..new_path)
      //p(path, stat)
      // helper to set target owner and mode to source's ones
      function set_perms(err) {
        if (err) { cb(err) ; return }
        chmod(new_path, stat.mode, function (err) {
          if (err) { cb(err) ; return }
          chown(new_path, stat.uid, stat.gid, function (err) {
            // FIXME: err is unknown is there were no rights to chown
            //if (err) { cb(err) ; return }
            cb()
          })
        })
      }
      // create target
      // directory
      if (stat.isDirectory()) {
        mkdir_p(new_path, stat.mode, set_perms)
      // file
      } else if (stat.isFile()) {
        // TODO: stream it
        read(path, function (err, data) {
          write(new_path, data, set_perms)
        })
      // symlink
      } else if (stat.isSymbolicLink()) {
        readlink(path, function (err, realpath) {
          if (err) { cb(err) ; return }
          symlink(realpath, new_path, set_perms)
        })
      // special nodes not supported
      // Fs.mknod() is missing
      // FIXME: ^^^
      } else {
        cb({path: path, code: 'ENOTSUPP'})
      }
    },
  }, callback)

}

/*
 * mimick ln -sf
 */
function ln_sf(target, path, callback) {
  path = Path.resolve(process.cwd(), path)
  mkdir_p(Path.dirname(path), '0755', function (err) {
    if (err) { callback(err) ; return }
    // FIXME: should we mimick -f // rm_rf basename(path) before this?
    rm_rf(path, function (err) {
      if (err) { callback(err) ; return }
      Fs.symlink(target, path, callback)
    })
  })
}

// export augmented Fs
Fs.mkdir_p = mkdir_p
Fs.find = find
Fs.rm_rf = rm_rf
Fs.cp_a = cp_a
Fs.ln_sf = ln_sf

module.exports = Fs
