import babel from 'rollup-plugin-babel';

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

export function build(done) {
	rollup.rollup({
		entry: path.join('src/index.js'),
		sourceMap: false,
		banner: copyright,
		plugins: [
			nodeResolve({
				jsnext: true,
				main: true
			}),
			babel({
				babelrc: false,
				sourceMaps: true,
				exclude: 'node_modules/**',
				plugins: env.NODE_ENV ? [
					'transform-flow-strip-types',
					'syntax-flow',
					'transform-remove-debugger',
					'transform-remove-console',
					'transform-undefined-to-void',
					'transform-inline-environment-variables'
				] : []
			}),
			// This allows you to require in CJS modules
			commonjsPlugin(),
			// This allows you to require in JSON files
			jsonPlugin(),
			stub(),
			typescript(),
			filesize(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				VERSION: pack.version
			})
		]
	}).then(function(bundle) {
		var result = bundle.generate({
			format: 'umd',
			sourceMap: 'inline',
			sourceMapSource: 'htzCookieModule.js',
			sourceMapFile: 'htzCookieModule.js',
			moduleName: 'htzCookieModule'
		});
		var code = `${result.code}\n//# sourceMappingURL=./${exportFileName}.js.map`;

		// Write the generated sourcemap
		mkdirp.sync(destinationFolder);
		fs.writeFileSync(path.join(destinationFolder, 'htzCookieModule.js'), code);
		fs.writeFileSync(path.join(destinationFolder, `htzCookieModule.js.map`), result.map.toString());

		$.file('htzCookieModule.js', code, { src: true })
			.pipe($.plumber())
			.pipe($.sourcemaps.init({ loadMaps: true }))
			.pipe($.sourcemaps.write('./', {addComment: false}))
			.pipe(gulp.dest(destinationFolder))
			.pipe($.filter(['*', '!**/*.js.map']))
			.pipe($.rename(exportFileName + '.min.js'))
			.pipe($.sourcemaps.init({ loadMaps: true }))
			.pipe($.uglify())
			.pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(destinationFolder))
			.on('end', done);
	}).catch(console.error);
}

const testFiles  = glob.sync('./src/**/*__tests__*/**/*.spec.browser.js');
//.concat(glob.sync('./src/**/*__tests__*/**/*spec.server.js'));
const allFiles = ['./config/browser.js'].concat(testFiles);

// Karma configuration
module.exports = function(config, specificOptions) {
  const configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'dirty-chai',
      'sinon',
      'sinon-chai'
    ],
    // list of files / patterns to load in the browser
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      '../specs/**/*spec.browser.js',
      '../specs/**/*spec.server.js'
    ],
    // list of files to exclude
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../src/**/*.js': ['sourcemap'],
      'test/**/*.js': ['rollup'],
      '../specs/**/*spec.server.js': ['webpack', 'sourcemap'],
      '../specs/**/*spec.browser.js': ['webpack', 'sourcemap']
    },
    rollupPreprocessor: {
      // rollup settings. See Rollup documentation
      plugins: [
        babel()
      ],
      // will help to prevent conflicts between different tests entries
      format: 'iife',
      sourceMap: 'inline'
    },
    webpack: {
      entry: allFiles,
      cache: true,
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
            exclude: /(src\/dist|.git|node_modules)/,
            loader: 'babel-loader',
            query: {
              cacheDirectory: true
            }
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],
    // reporter options
    mochaReporter: {
      colors: {
        success: 'green',
        info: 'bgYellow',
        warning: 'cyan',
        error: 'bgRed'
      },
      divider: ''
    },

    browsers: ['Chrome'],
    customLaunchers: {
      ChromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 4,
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 100000,
    browserNoActivityTimeout: 30000,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCI'];
    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
    configuration.browserNoActivityTimeout = 120000;
  }

  config.set(configuration);
};