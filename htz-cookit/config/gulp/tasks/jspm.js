/**
 * Created by elia.grady on 04/08/2016.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import jspm from 'jspm';

import pkg from './../../../package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('jspm', ['eslint'], (cb) => {
  const builder = new jspm.Builder();

  builder.buildStatic(
    'js/head',
    'js/dist/bodyBundle.js',
    {
      minify: false,
      format: 'global',
      globalName: 'Achbar',
      sourceMaps: true,
    }
  ).then(
    builder.
    buildStatic(
      'js/head',
      'js/dist/bodyBundle.min.js',
      {
        minify: true,
        format: 'global',
        globalName: 'Achbar',
        sourceMaps: true,
      }
    )
  )
    .then(() => {
      cb();
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      cb();
    });
});

gulp.task('jspm:watch', () => {
  gulp.watch('js/body/**/*', ['jspm:body']);
});

function eslint(files, options) {
  return () => gulp.src(files)
    .pipe(reload({ stream: true, once: true }))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('eslint', eslint(['**/*.js']));


gulp.task('serve', () => {
  browserSync({
    notify: true,
    port: 9001,
    server: {
      baseDir: './',
    },
  });

  gulp.watch(['src/**/*.js', 'test.js', 'index.html', 'test.css'], ['eslint']).on('change', reload);
});

// Build for deployment
gulp.task('default', ['serve']);
