module.exports = function (grunt) {
	'use strict';

	require('source-map-support').install();

	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-ts-clean');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			support: {
				options: {
					node: true
				},
				src: ['Gruntfile.js', 'tasks/**/*.*.js']
			}
		},
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json')
			},
			src: ['src/**/*.ts'],
			test: ['test/**/*.ts']
		},
		clean: {
			tmp: [
				'tmp/**/*'
			],
			dist: [
				'dist/**/*'
			]
		},
		ts: {
			options: {
				fast: 'never',
				target: 'es5',
				module: 'commonjs',
				sourcemap: true,
				declaration: true,
				comments: true,
				verbose: true,
				noImplicitAny: true
			},
			index: {
				src: ['src/index.ts'],
				outDir: 'dist/'
			},
			test: {
				src: ['test/**.ts'],
				outDir: 'tmp/'
			}
		},
		ts_clean: {
			dist: {
				src: ['dist/**/*'],
				dot: true
			}
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter'
			},
			all: {
				src: ['tmp/test/**/*.test.js']
			}
		}
	});

	grunt.registerTask('prep', [
		'clean',
		'jshint:support'
	]);

	grunt.registerTask('build', [
		'prep',
		'ts:index',
		'tslint:src'
	]);

	grunt.registerTask('test', [
		'build',
		'ts:test',
		'tslint:test',
		'mochaTest:all'
	]);

	grunt.registerTask('dev', [
		'clean:tmp',
		'ts:test',
		'mochaTest:all'
	]);

	grunt.registerTask('prepublish', [
		'build',
		'ts_clean:dist'
	]);

	grunt.registerTask('default', ['build']);
};
