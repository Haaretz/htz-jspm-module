/**
 * Created by elia.grady on 04/08/2016.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

import pkg from './../../../package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('serve', () => {
  browserSync({
    notify: true,
    port: 9001,
    server: {
      baseDir: './',
    },
  });

  gulp.watch(['src/**/*.js', 'test/test.js', 'test/index.html', 'test/test.css'], ['eslint']).on('change', reload);
});

gulp.task('serve:docs', ['jsdoc'], () => {
  browserSync({
    notify: true,
    port: 9002,
    server: {
      baseDir: `./docs/<%= moduleSafeName %>/${pkg.version}`,
    },
  });

  gulp.watch(['src/**/*.js', 'README.md'], ['jsdoc']).on('change', reload);
});


// Build for deployment
gulp.task('default', ['serve']);