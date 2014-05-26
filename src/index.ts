/// <reference path="../typings/tsd.d.ts" />

import fs = require('fs');
import path = require('path');
import assert = require('assert');

import through2 = require('through2');
import minimatch = require('minimatch');

function dummy(value: string): boolean {
	return true;
}

function getMatcher(pattern: string, options?: minimatch.IOptions): (str: string) => boolean {
	if (!pattern) {
		return dummy;
	}
	return minimatch.filter(pattern, options);
}

function filterDefs(filter: filterDefs.Filter): NodeJS.ReadWriteStream {
	assert((typeof filter === 'object' && filter), 'filter must be an object');

	var nameTest = getMatcher(filter.name);
	var pathTest = getMatcher(filter.path, {
		matchBase: /\/|\\/.test(filter.path)
	});

	return through2.obj(function (def: filterDefs.Def, enc: string, callback: () => void) {
		if (nameTest(def.name) && pathTest(def.path)) {
			this.push(def);
		}
		callback();
	});
}

module filterDefs {
	export interface Def {
		path: string;
		size: number;
		project: string;
		name: string;
		semver?: string;
	}

	export interface Filter {
		name?: string;
		path?: string;
		semver?: string;
	}
}

export = filterDefs;
