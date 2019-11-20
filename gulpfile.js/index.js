const { src, dest, parallel, watch } = require('gulp');
const $ = require('./modules.js');
const uglify = $.composer($.uglifyes, $.composer);

function html() {
  return src(['./src/pug/*.pug', '!./src/pug/**/_*.pug'])
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(
      $.pug({
        pretty: true
      })
    )
    .pipe(dest('./dist'))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function css() {
  return src('./src/scss/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(dest('./dist/css'))
    .pipe(
      $.rename({
        suffix: '.min'
      })
    )
    .pipe($.minifyCSS())
    .pipe(dest('./dist/css'))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function js() {
  return src('./src/js/*.js', { sourcemaps: true })
    .pipe($.plumber())
    .pipe(uglify({ output: { comments: /^!/ } }))
    .pipe(
      $.concat('main.min.js', {
        newLine: '\n'
      })
    )
    .pipe(dest('./dist/js', { sourcemaps: true }))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function img() {
  return src('./src/img/**')
    .pipe($.changed('./dist/img/'))
    .pipe(
      $.imagemin({
        optimizationLevel: 3
      })
    )
    .pipe(dest('./dist/img/'));
}

function bs() {
  $.browserSync.init({
    server: {
      baseDir: './dist/'
    },
    notify: true,
    xip: false
  });
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.bs = bs;
exports.img = img;

exports.default = parallel([html, css, js, img, bs], () => {
  watch('./src/pug/**', html);
  watch('./src/scss/**', css);
  watch('./src/js/**', js);
  watch('./src/img/**', img);
});
