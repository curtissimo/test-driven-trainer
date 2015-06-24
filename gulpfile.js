require('babel-core/polyfill');

var babel = require('gulp-babel');
var del = require('del');
var electron = require('gulp-electron');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdir = require('mkdirp');
var ncp = require('ncp').ncp;
var path = require('path');
var prefix = require('gulp-autoprefixer');
var gulp = require('gulp');
var sass = require('gulp-sass');

var electronVersion = 'v0.28.3';

gulp.task('ace', function () {
  return gulp.src('./vendor/ace-builds/src-min-noconflict/**/*.*')
    .pipe(gulp.dest('./build/vendor/ace'));
});

gulp.task('babel', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build'));
});

gulp.task('clean', [ 'clean:dist' ], function (cb) {
  del([ 'build' ], cb);
});

gulp.task('clean:all', [ 'clean' ], function (cb) {
  del([ 'cache' ], cb);
});

gulp.task('clean:dist', function (cb) {
  del([ 'dist' ], cb);
});

gulp.task('cp-css-to-dist', [ 'sass' ], function () {
  var p = path.join('.', 'dist', electronVersion, 'win32-x64', 'resources', 'app');
  gulp.src('./build/**/*.css')
    .pipe(gulp.dest(p))
});

gulp.task('cp-html-to-dist', function () {
  var p = path.join('.', 'dist', electronVersion, 'win32-x64', 'resources', 'app');
  gulp.src('./build/**/*.html')
    .pipe(gulp.dest(p))
});

gulp.task('cp-js-to-dist', [ 'babel' ], function () {
  var p = path.join('.', 'dist', electronVersion, 'win32-x64', 'resources', 'app');
  gulp.src('./build/**/*.js')
    .pipe(gulp.dest(p))
});

gulp.task('cp-icns:mac', [ 'pack' ], function () {
  var p = path.join(__dirname, 'cache', 'icons', 'mac', 'atom.icns');
  var d = path.join(__dirname, 'dist', electronVersion, 'darwin-x64', 'test-driven-trainer.app', 'Contents', 'Resources');
  return gulp.src(p)
    .pipe(gulp.dest(d));
});

gulp.task('cp-ico:win', [ 'pack' ], function () {
  var p = path.join(__dirname, 'cache', 'icons', 'win', 'logo.ico');
  var d = path.join(__dirname, 'dist', electronVersion, 'win32-x64');
  return gulp.src(p)
    .pipe(gulp.dest(d));
});

gulp.task('cp-pngs:web', [ 'icons' ], function () {
  gulp.src('./cache/icons/mac/atom.iconset/icon_512x512.png')
    .pipe(gulp.dest('./build/client'));
});

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/*.*')
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('icons', function (done) {
  var p = path.join(__dirname, 'cache', 'icons', 'mac', 'atom.iconset');
  var w = path.join(__dirname, 'cache', 'icons', 'win');
  var ico = path.join(p, 'icon_512x512@2x.png');
  var s = path.join(__dirname, 'art', 'icon.svg');

  return new Promise(function (good, bad) {
    exec('mkdir -p ' + p, function (e) {
      if (e) {
        return bad(e);
      }
      good();
    });
  })
  .then(function () {
    return new Promise(function (good, bad) {
      exec('inkscape -e ' + ico + ' -w 1024 -h 1024 -D ' + s, function (e) {
        if (e) {
          return bad(e);
        }
        good();
      });
    });
  })
  .then(function () {
    var promises = [];

    function sips(size, hd) {
      var s = hd? size / 2 : size;
      var suffix = hd? '@2x.png' : '.png';

      return new Promise(function (good, bad) {
        var command = [
          'sips -z',
          size, size,
          ico,
          '--out',
          path.join(p, 'icon_' + s + 'x' + s + suffix)
        ];
        exec(command.join(' '), function (e) {
          if (e) {
            return bad(e);
          }
          good();
        });
      });
    }

    promises.push(sips(16));
    promises.push(sips(32, true));
    promises.push(sips(32));
    promises.push(sips(64, true));
    promises.push(sips(128));
    promises.push(sips(256, true));
    promises.push(sips(256));
    promises.push(sips(512, true));
    promises.push(sips(512));
    return Promise.all(promises);
  })
  .then(function () {
    return new Promise(function (good, bad) {
      exec('iconutil -c icns ' + p, function (e) {
        if (e) {
          return bad(e);
        }
        good();
      });
    });
  })
  .then(function () {
    return new Promise(function (good, bad) {
      exec('mkdir -p ' + w, function (e) {
        if (e) {
          return bad(e);
        }
        good();
      });
    });
  })
  .then(function () {
    var command = [
      'png2ico',
      path.join(w, 'logo.ico'),
      path.join(p, 'icon_16x16.png'),
      path.join(p, 'icon_32x32.png'),
      path.join(p, 'icon_128x128.png'),
    ];
    return new Promise(function (good, bad) {
      exec(command.join(' '), function (e) {
        if (e) {
          return bad(e);
        }
        good();
      });
    });
  });
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

gulp.task('pack', [ 'build', 'clean:dist' ], function () {
  var packageJson = JSON.parse(fs.readFileSync('./build/package.json', 'utf8'));
  return gulp.src('')
    .pipe(electron({
      src: './build',
      packageJson: packageJson,
      release: './dist',
      cache: './cache',
      version: electronVersion,
      platforms: [ 'darwin-x64', 'win32-x64', ] //'win32-ia32' ]
    }))
    .pipe(gulp.dest(''));
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

gulp.task('rename:win', [ 'pack' ], function (done) {
  var p = path.join(__dirname, 'dist', electronVersion, 'win32-x64');
  var s = path.join(p, 'test-driven-trainer.exe');
  var d = path.join(p, 'Test Driven Trainer.exe');
  fs.rename(s, d, done);
});

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', [ 'build' ], function () {
  gulp.watch('./src/**/*.js', [ 'babel', 'cp-js-to-dist' ]);
  gulp.watch('./src/**/*.html', [ 'html', 'cp-html-to-dist' ]);
  gulp.watch('./src/**/*.scss', [ 'sass', 'cp-css-to-dist' ]);
});



gulp.task('app-source', [ 'babel', 'fonts', 'html', 'package.json', 'sass' ]);
gulp.task('build', [ 'app-source', 'ace', 'icons', 'modules', 'cp-pngs:web' ]);
gulp.task('cp-icons', [ 'cp-icns:mac', 'cp-ico:win' ]);
gulp.task('dev', [ 'build', 'watch' ]);
gulp.task('dist', [ 'build', 'pack', 'cp-icons', 'rename' ]);
gulp.task('default', [ 'build' ]);
gulp.task('rename', [ 'rename:win' ]);
