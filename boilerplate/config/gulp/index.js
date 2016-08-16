import gulp from 'gulp';
import fs from 'fs';
import onlyScripts from './util/scriptFilter';

const tasks = fs.readdirSync('./config/gulp/tasks/').filter(onlyScripts);

// Ensure process ends after all Gulp tasks are finished
gulp.on('stop', () => {
	if ( !global.isWatching ) {
		process.nextTick(() => {
			process.exit(0);
		});
	}
});

tasks.forEach((task) => {
	require('./tasks/' + task);
});