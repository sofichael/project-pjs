/*global -$ */
'use strict';
// generated on 2015-06-10 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function () {
  return gulp.src('app/styles/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.minifyCss())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}))
    .pipe($.notify({ message: 'styles task complete'}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    //.pipe($.if(!browserSync.active, $.jshint.reporter('fail'))) //有错误生成不了文件
    .pipe($.concat('app.js'))
    .pipe($.uglify({mangle:false}))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe($.notify({ message: 'Scripts service controller task complete'}));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({mangle:false})))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe($.revAppend())
    .pipe(gulp.dest('dist'));
});

// gulp.task('index',  function () {
//   var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

//   return gulp.src('app/login.html')
//     .pipe(assets)
//     .pipe($.if('*.js', $.uglify({mangle:false})))
//     .pipe($.if('*.css', $.csso()))
//     .pipe(assets.restore())
//     .pipe($.useref())
//     .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
//     .pipe($.revAppend())
//     .pipe(gulp.dest('./'));
// });


gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      distgressive: true,
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false,removeViewBox: false}],
      use: [require('imagemin-pngquant')()]
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.notify({ message: 'Images task complete' }));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
   gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

   gulp.src([
    'media/dist/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/media'));

   gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));
});

gulp.task('clean', require('del').bind(null, ['.tmp']));

gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'dist'],
      index: 'index.html',
      // routes: {
      //   // '/bower_components': 'bower_components',
      //   // '/media': 'media'
      // }
    }
  });

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('media/dist/**/*', ['extras']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/**/*.js', ['jshint']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('wp', ['clean'], function () {
  gulp.start('build');
});
