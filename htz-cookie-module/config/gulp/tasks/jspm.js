/**
 * Created by elia.grady on 04/08/2016.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import jspm from 'jspm';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('jspm', ['eslint'], (cb) => {
  const builder = new jspm.Builder();

  builder.buildStatic(
    'js/head',
    'js/dist/htzCookieModule.js',
    {
      minify: false,
      format: 'global',
      globalName: 'htzCookieModule',
      sourceMaps: true,
    }
  ).then(
    builder.
    buildStatic(
      'js/head',
      'js/dist/htzCookieModule.min.js',
      {
        minify: true,
        format: 'global',
        globalName: 'htzCookieModule',
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