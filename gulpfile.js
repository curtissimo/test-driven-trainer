require('babel-core/polyfill');

var babel = require('gulp-babel');
var del = require('del');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdir = require('mkdirp');
var ncp = require('ncp').ncp;
var path = require('path');
var gulp = require('gulp');

gulp.task('ace', function () {
  return gulp.src('./vendor/ace/**/*')
    .pipe(gulp.dest('./build/vendor'));
});

gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build'));
});

gulp.task('clean', function (cb) {
  del([ 'dist', 'build' ], cb);
});

gulp.task('modules', function () {
  return new Promise(function (good, bad) {
    var p = path.join(__dirname, 'package.json');
    fs.readFile(p, 'utf8', function (e, d) {
      if (e) {
        return bad(e);
      }
      good(d);
    });
  })
  .then(function (packageJson) {
    var dependencies = JSON.parse(packageJson).dependencies;
    var packages = Object.keys(dependencies);
    var promises = [];
    var sourcePath = null;
    var destPath = null;
    var copier = null;

    function copyPromise(source, dest) {
      return new Promise(function (good, bad) {
        del(dest, function (oops) {
          if (oops) {
            return bad(oops);
          }
          mkdir(dest, function (e) {
            if (e) {
              return bad(e);
            }
            var opts = {
              stopOnErr: true,
              clobber: true
            };
            ncp(source, dest, opts, function (err) {
              if (err) {
                return bad(err);
              }
              good();
            });
          });
        });
      });
    }

    for(var i = 0; i < packages.length; i += 1) {
      sourcePath = path.join(__dirname, 'node_modules', packages[i]);
      destPath = path.join(__dirname, 'build', 'node_modules', packages[i]);
      promises.push(copyPromise(sourcePath, destPath));
    }

    return Promise.all(promises);
  });
});

gulp.task('pack', [ 'build' ], function (cb) {
  var outdir = path.join(__dirname, 'dist');
  var exe = path.join(__dirname, 'node_modules', 'asar', 'bin', 'asar');
  var out = path.join(outdir, 'test-driven-training.asar');
  var command = [ exe, 'pack', 'build', out ];
  mkdir(outdir, function (err) {
    if (err) {
      return cb(err);
    }
    exec(command.join(' '), cb);
  });
});

gulp.task('package.json', function (done) {
  new Promise(function (good, bad) {
    var p = path.join(__dirname, 'package.json');
    fs.readFile(p, 'utf8', function (e, d) {
      if (e) {
        return bad(e);
      }
      good(d);
    });
  })
  .then(function (packageJson) {
    var builddir = path.join(__dirname, 'build');
    var p = path.join(builddir, 'package.json');
    var descriptor = JSON.parse(packageJson);
    var build = {
      name: descriptor.name,
      version: descriptor.version,
      main: path.basename(descriptor.main)
    };
    mkdir(builddir, function (err) {
      if (err) {
        return done(err);
      }
      fs.writeFile(p, JSON.stringify(build), function (e) {
        if (e) {
          done(e);
        }
        done();
      });
    });
  });
});

gulp.task('watch', [ 'build' ], function () {
  gulp.watch('./src/**/*.js', [ 'babel' ]);
});



gulp.task('app-source', [ 'babel', 'package.json' ]);
gulp.task('build', [ 'app-source', 'ace', 'modules' ]);
gulp.task('dev', [ 'build', 'watch' ]);
gulp.task('dist', [ 'build', 'pack' ]);
gulp.task('default', [ 'build' ]);
