import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();
// import eslint from 'gulp-eslint';

// Lint a set of files
function lint(files, options) {
  return () => gulp.src(files)
    .pipe(reload({ stream: true, once: true }))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

// Lint our source code
gulp.task('lint:src', () => lint('src/**/*.js'));

// Lint our test code
gulp.task('lint:tests', () => lint('specs/**/*.js'));

// Lint this file
gulp.task('lint:gulp', () => lint('gulpfile.babel.js'));

// Lint everything
gulp.task('lint:all', ['lint:src', 'lint:tests', 'lint:gulp']);
