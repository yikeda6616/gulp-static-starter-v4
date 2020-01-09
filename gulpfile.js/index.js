const { src, dest, parallel, watch } = require('gulp');

const $ = require('./modules.js');
const uglify = $.composer($.uglifyes, $.composer);
const tsProject = $.ts.createProject('./tsconfig.json');

const CONF = {
  MODE_DEV: true,
  PUG: {
    SOURCE: ['./src/pug/*.pug', '!./src/pug/**/_*.pug'],
    OUTPUT: './dist'
  },
  SASS: {
    SOURCE: './src/scss/**/*.scss',
    OUTPUT: './dist/css/'
  },
  TS: {
    SOURCE: './src/ts/**/*.ts',
    OUTPUT: './dist/js/'
  },
  IMG: {
    SOURCE: './src/img/**',
    OUTPUT: './dist/img/'
  },
  BS: {
    BASEDIR: './dist/'
  }
}

CONF.MODE_DEV && console.log('Gulp running on Development mode...');

function html() {
  return src(CONF.PUG.SOURCE)
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
    .pipe(dest(CONF.PUG.OUTPUT))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function css() {
  return src(CONF.SASS.SOURCE, { sourcemaps: CONF.MODE_DEV })
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe($.autoprefixer())
    .pipe(dest(CONF.SASS.OUTPUT))
    .pipe(
      $.rename({
        suffix: '.min'
      })
    )
    .pipe($.minifyCSS())
    .pipe(dest(CONF.SASS.OUTPUT, { sourcemaps: CONF.MODE_DEV }))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function js() {
  const tsResult = src(CONF.TS.SOURCE, { sourcemaps: CONF.MODE_DEV })
    .pipe($.plumber())
    .pipe(tsProject())

  return tsResult.js
    .pipe(dest(CONF.TS.OUTPUT))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(uglify({ output: { comments: /^!/ } }))
    .pipe(
      $.concat('main.min.js', {
        newLine: '\n'
      })
    )
    .pipe(dest(CONF.TS.OUTPUT, { sourcemaps:CONF.MODE_DEV }))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true
      })
    );
}

function img() {
  return src(CONF.IMG.SOURCE)
    .pipe($.changed(CONF.IMG.OUTPUT))
    .pipe(
      $.imagemin({
        optimizationLevel: 3
      })
    )
    .pipe(dest(CONF.IMG.OUTPUT));
}

function bs() {
  $.browserSync.init({
    server: {
      baseDir: CONF.BS.BASEDIR
    },
    notify: true,
    xip: false
  });
}

function watcher() {
  watch('./src/pug/**', html);
  watch('./src/scss/**', css);
  watch('./src/ts/**', js);
  watch('./src/img/**', img);
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.bs = bs;
exports.img = img;

exports.default = parallel([html, css, js, img, bs], watcher);
