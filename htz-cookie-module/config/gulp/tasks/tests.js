import gulp from 'gulp';
import path from 'path';
import mocha from 'gulp-mocha';
import {Server} from 'karma';
import { mochaGlobals } from '../config';

// import { build as karmaConfig } from '../../karma.conf.js';
const karmaConfig = path.resolve('config/karma.conf.js');


function startKarma(browser, fn) {
	new Server({
		configFile: karmaConfig,
		singleRun: true,
		browsers: [browser]
	}, fn).start();
}

// Run all unit tests for server
gulp.task('test:server', () => {
	require('babel-register');
	return gulp.src(['config/setup/node.js', './specs/**/*spec.browser.js', './specs/**/*spec.server.js'], {
			read: false
		})
        // same settings as mocha.opts in the CI, and used inside package.json
		.pipe(mocha({
			reporter: 'spec',
            compilers: 'js:babel-core/register',
			ui: 'bdd',
			timeout: 15000,
			globals: Object.keys(mochaGlobals),
			ignoreLeaks: false
		}));
});

// Run Karma with PhantomJS browser
gulp.task('karma:phantom', (done) => {
	process.env.NODE_ENV = 'test';
	startKarma('PhantomJS', done);
});

// Run Karma with Chrome browser
gulp.task('karma:chrome', (done) => {
	process.env.NODE_ENV = 'test';
	startKarma('Chrome', done);
});

// Run Karma with Firefox browser
gulp.task('karma:firefox', (done) => {
		process.env.NODE_ENV = 'test';
		startKarma('Firefox', done);
	}
);