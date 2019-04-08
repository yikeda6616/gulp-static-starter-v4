module.exports = {
  pug: require('gulp-pug'),
  sass: require('gulp-sass'),
  minifyCSS: require('gulp-csso'),
  concat: require('gulp-concat'),
  browserSync: require('browser-sync'),
  plumber: require('gulp-plumber'),
  notify: require('gulp-notify'),
  autoprefixer: require('gulp-autoprefixer'),
  sourcemaps: require('gulp-sourcemaps'),
  rename: require('gulp-rename'),
  imagemin: require('gulp-imagemin'),
  changed: require('gulp-changed'),
  uglifyes: require('uglify-es'),
  composer: require('gulp-uglify/composer')
};
