'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
   connect = require('gulp-connect'),
       del = require('del');



const concatSripts = () => {
  return gulp.src([
       'js/global.js',
       'js/circle/autogrow.js',
       'js/circle/circle.js'])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
}

const minifyScripts = () => {
  return gulp.src('js/app.js')
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('js'));
}

const compileSass = () => {
  return gulp.src('sass/global.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'))
  .pipe(connect.reload());
}

const minifyStyles = () => {
  return gulp.src('css/global.css')
  .pipe(cleanCSS())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest('css'));
}

const optImages = () => {
  return gulp.src('images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/content'));
}

const distScripts = () => {
  return gulp.src(['js/all.min.js', 'js/app.js.map'])
  .pipe(gulp.dest('dist/scripts'));
}

const distStyles = () => {
  return gulp.src(['css/all.min.css', 'css/global.css.map'])
  .pipe(gulp.dest('dist/styles'));
}

const cleanFolders = (done) => {
  del(['dist', 'js/app*.js*', 'js/*min.js', 'css']);
  done();
}

const connectServer = (done) => {
  connect.server({port: 3000, livereload: true});
  done();
}

const watchSass = (done) => {
  gulp.watch('sass/**/*.scss', gulp.series('styles'));
  done();
}

gulp.task ('scripts', gulp.series(concatSripts, minifyScripts, distScripts));

gulp.task ('styles', gulp.series(compileSass, minifyStyles, distStyles));

gulp.task ('images', gulp.series(optImages));

gulp.task ('clean', gulp.series(cleanFolders));

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('scripts', 'styles', 'images')
));

gulp.task('default', gulp.series('build', connectServer, watchSass));
