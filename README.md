Usage
-----

    // import augmented 'fs' module
    var Fs = require('meta-fs')

    // print everything under /etc
    Fs.find('/etc', {
      match_fn: function (path, stat, depth, cb) {
        console.log('FOUND', path)
        // you can stop walking by passing an error to `cb`
        cb(depth > 3 and true or nil)
      }
    }, function (err) {
      console.log('DONE', err)
    })


    // remove /home/foo completely
    Fs.rm_rf('/home/foo', console.log)


    // make nested directories
    Fs.mkdir_p('/home/foo/bar/baz', console.log)


    // copy source file/directory
    Fs.cp_a('/home/foo/bar/baz', '/tmp/wow', console.log)


    // make symlink
    Fs.ln_sf('/etc/passwd', '/tmp/passes', console.log)


License
-------

Check [here](license.txt).
