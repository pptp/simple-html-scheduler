"use strict";

let gulp    = require("gulp");

let htmlmin  = require('gulp-htmlmin');
let jsonminify = require('gulp-jsonminify');
let del = require('del');
let open = require('open');

let webpack = require("webpack");
let WebpackServer = require("webpack-dev-server");

let webpackConfig = require('./webpack.config.js');

gulp.task("clean", done => {
  del(['app/*']);
  done();
});

gulp.task('html', done => {
  return gulp.src('src/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app'));
});

gulp.task('json', done => {
  return gulp.src(['src/data/*.json'])
    .pipe(jsonminify())
    .pipe(gulp.dest('app/data'));
})

gulp.task('watch', function() {
  open("localhost:8086/app");
  let compiler = webpack(webpackConfig);

  let server = new WebpackServer(compiler, {
    hot: true,
    inline: true,
    publicPath: '/app/',
  })

  server.listen(8086);
});

gulp.task('build', ['clean'], function(done) {
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      throw err;
    }
    gulp.start(['html', 'json']);
    done();
  })
})

gulp.task('default', ['build'])