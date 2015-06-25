var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var combine = require('gulp-magix-combine');
var spmlog = require('gulp-magix-spmlog');

var globs = [
  '.jshintrc',
  'app/**/*.js',
  'build/**/*.js'
];

gulp.task('jshint', ['css'], function() {
  return gulp.src(globs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
})

gulp.task('less', ['clean'], function() {
  return gulp.src('./app/exts/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./build/app_debug/exts'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/app/exts'));
});

gulp.task('css', ['less'], function() {
  return gulp.src('./app/assets/css/**/quake.less')
    .pipe(less())
    .pipe(gulp.dest('./build/app_debug/assets/css/'))
    .pipe(cssmin({
      compatibility: 'ie7'
    }))
    .pipe(gulp.dest('./build/app/assets/css/'));
});

/*
 * Concat JavaScript and HTML of View
 */

gulp.task('js', ['jshint'], function() {
  gulp.src('./app/views/**/*.js')
    .pipe(combine({
      magixVersion: 2.0
    }))
    .pipe(gulp.dest('./build/app_debug/views'))
    .pipe(uglify({
      output: {
        ascii_only: true
      }
    }))
    .pipe(gulp.dest('./build/app/views'));

  gulp.src(['./app/**/*.js', '!./app/views/**/*.js'])
    .pipe(gulp.dest('./build/app_debug/'))
    .pipe(uglify({
      output: {
        ascii_only: true
      }
    }))
    .pipe(gulp.dest('./build/app/'));
});

gulp.task('clean', function() {
  return gulp.src(['./build/'], {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});


/*
 * 黄金令箭埋点
 * @params logkey 申请到的业务串
 */

gulp.task('spmlog', function() {
  gulp.src('./app/views/**/*.html')
    .pipe(spmlog({
      logkey: 'tblm.88.1',
      filter: [
        '[mx-click]',
        '[href^="#!"]'
      ]
    }))
    .pipe(gulp.dest('./app/views/'));
});



// 打包压缩
gulp.task('build', ['js']);