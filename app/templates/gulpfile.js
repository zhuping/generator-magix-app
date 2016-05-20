var gulp    = require('gulp')
var less    = require('gulp-less')
var uglify  = require('gulp-uglify')
var cssmin  = require('gulp-cssmin')
var clean   = require('gulp-clean')
var combine = require('gulp-magix-combine')
var jshint  = require('gulp-jshint')

var globs = [
  '.jshintrc',
  'app/**/*.js',
  'build/**/*.js'
];

gulp.task('jshint', ['css'], function() {
  return gulp.src(globs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('less', ['clean'], function() {
  return gulp.src('./app/exts/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./build/app_debug/exts'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/app/exts'));
});

gulp.task('css', ['less'], function() {
  return gulp.src('./app/assets/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('./build/app_debug/assets/'))
    .pipe(cssmin({
      compatibility: 'ie7'
    }))
    .pipe(gulp.dest('./build/app/assets/'));
});

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
      },
      preserveComments: function(node, comment){
        return /@heredoc|@preserve|@license|@cc_on/i.test(comment.value);
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

// 打包压缩
gulp.task('default', ['js']);