/**
 * Created by elia.grady on 04/08/2016.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

import pkg from './../../../package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('jsdoc', $.shell.task([
  'jsdoc --verbose -c jsdoc.conf.json',
]));

// Push documentation to github
gulp.task('gh-pages', $.shell.task([
  './gh-pages.sh',
  `git subtree push --prefix docs/htz-cookit/${pkg.version} origin gh-pages`,
]));

gulp.task('cleanDocs', del.bind(null, ['docs']));

gulp.task('serve:docs', ['jsdoc'], () => {
  browserSync({
    notify: true,
    port: 9002,
    server: {
      baseDir: `./docs/htz-cookit/${pkg.version}`,
    },
  });

  gulp.watch(['src/**/*.js', 'README.md'], ['jsdoc']).on('change', reload);
});
