import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import glob from 'glob';
import path from 'path';
import webpack from 'webpack';
import plumber from 'gulp-plumber';
import livereload from 'gulp-livereload';
import webpackStream from 'webpack-stream';
import karma from 'karma';

// Remove our temporary files
gulp.task('clean:tmp', (done) => {
	del(['tmp']).then(() => done());
});

// Set up a livereload environment for our spec runner `test/runner.html`
gulp.task('browser', ['clean:tmp'], () => {
	// Our testing bundle is made up of our unit tests, which
	// should individually load up pieces of our application.
	// We also include the browser setup file.
	const testFiles = glob.sync('./specs/**/*spec.browser.js')
		.concat(glob.sync('./specs/**/*spec.server.js'));
	const allFiles = ['./config/setup/browser.js'].concat(testFiles);

	// Lets us differentiate between the first build and subsequent builds
	let firstBuild = true;

	// This empty stream might seem like a hack, but we need to specify all of our files through
	// the `entry` option of webpack. Otherwise, it ignores whatever file(s) are placed in here.
	return gulp.src('')
		.pipe(plumber())
		.pipe(webpackStream({
			watch: true,
			entry: allFiles,
			output: {
				filename: '__spec-build.js'
			},
			module: {
				loaders: [
					// Use imports loader to hack webpacking sinon.
					// https://github.com/webpack/webpack/issues/177
					{
						test: /sinon\.js/,
						loader: 'imports?define=>false,require=>false'
					},

					// Perform babel transpiling on all non-source, test files.
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader'
					},
					// This allows the test setup scripts to load `package.json`
					{
						test: /\.json$/,
						exclude: /node_modules/,
						loader: 'json-loader'
					}
				]
			},
			plugins: [
				// By default, webpack does `n=>n` compilation with entry files. This concatenates
				// them into a single chunk.
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 1
				})
			],
			devtool: 'inline-source-map'
		}, null, function() {
			if (firstBuild) {
				livereload.listen({
					port: 35729,
					host: 'localhost',
					start: true
				});
			} else {
				livereload.reload('./tmp/__spec-build.js');
			}
			firstBuild = false;
		}))
		.pipe(gulp.dest('./tmp'));
});