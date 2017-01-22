var gulp = require('gulp'),
  usemin = require('gulp-usemin'),
  wrap = require('gulp-wrap'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  minifyCss = require('gulp-cssnano'),
  minifyJs = require('gulp-uglify'),
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  minifyHTML = require('gulp-htmlmin');

var paths = {
  scripts: 'src/js/**/*.*',
  styles: 'src/less/**/*.*',
  images: 'src/img/**/*.*',
  templates: 'src/templates/**/*.html',
  index: 'src/index.html',
  bower_fonts: 'src/components/**/*.{ttf,woff,eof,svg}',
};


var app = require('express')();
var watson = require('watson-developer-cloud');

var textToSpeech = watson.text_to_speech({
  version: 'v1',
  username: '6915b2c1-4e50-44bd-9f46-a5fcb1195fcc',
  password: 'aB5JL1NPJ72m',
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
});

var fs = require("fs");
app.get('/api/synthesize', function(req, res, next) {
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('error', function(error) {
    next(error);
  });
  transcript.pipe(res);
});

app.listen(4007);
console.log('Watson API listening at: 4007');
/**
 * Handle bower components from index
 */
gulp.task('usemin', function() {
  return gulp.src(paths.index)
    .pipe(usemin({
      js: [minifyJs(), 'concat'],
      css: [minifyCss({
        keepSpecialComments: 0
      }), 'concat'],
    }))
    .pipe(gulp.dest('dist/'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function() {
  return gulp.src(paths.bower_fonts)
    .pipe(rename({
      dirname: '/fonts'
    }))
    .pipe(gulp.dest('dist/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-templates']);

gulp.task('custom-images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/img'));
});

gulp.task('custom-js', function() {
  return gulp.src(paths.scripts)
    .pipe(minifyJs())
    .pipe(concat('dashboard.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('custom-less', function() {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('custom-templates', function() {
  return gulp.src(paths.templates)
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist/templates'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function() {
  gulp.watch([paths.images], ['custom-images']);
  gulp.watch([paths.styles], ['custom-less']);
  gulp.watch([paths.scripts], ['custom-js']);
  gulp.watch([paths.templates], ['custom-templates']);
  gulp.watch([paths.index], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 8888
  });
});

gulp.task('livereload', function() {
  gulp.src(['dist/**/*.*'])
    .pipe(watch(['dist/**/*.*']))
    .pipe(connect.reload());
});

/**
 * Gulp tasks
 */
gulp.task('build', ['usemin', 'build-assets', 'build-custom']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
