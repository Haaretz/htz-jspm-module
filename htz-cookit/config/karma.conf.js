function build(done) {
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
			sourceMapSource: '<%= moduleCamelCaseName %>.js',
			sourceMapFile: '<%= moduleCamelCaseName %>.js',
			moduleName: '<%= moduleCamelCaseName %>'
		});
		var code = `${result.code}\n//# sourceMappingURL=./${exportFileName}.js.map`;

		// Write the generated sourcemap
		mkdirp.sync(destinationFolder);
		fs.writeFileSync(path.join(destinationFolder, '<%= moduleCamelCaseName %>.js'), code);
		fs.writeFileSync(path.join(destinationFolder, `<%= moduleCamelCaseName %>.js.map`), result.map.toString());

		$.file('<%= moduleCamelCaseName %>.js', code, { src: true })
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