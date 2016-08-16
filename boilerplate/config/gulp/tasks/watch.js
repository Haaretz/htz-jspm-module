import gulp from 'gulp';

// Run the headless unit tests as you make changes.
gulp.task('watch:server',() => {
	gulp.watch(['src/**/*', './specs/**/*spec.browser.js', './specs/**/*spec.server.js', 'package.json', '**/.eslintrc'], ['test']);
});