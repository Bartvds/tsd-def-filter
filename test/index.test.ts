/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');

var assert = chai.assert;

import path = require('path');
import findup = require('findup-sync');
import streamTo = require('stream-to-array');

import Filter = require('../src/index');

import FSRepo = require('tsd-repo-fs');
import getDefs = require('tsd-def-tree');

import filter = require('../src/index');

var baseDir = path.join(path.dirname(findup('package.json')), 'test', 'fixtures', 'dir');

function sortDefs(arr: filter.Def[]) {
	return arr.sort((a: filter.Def, b: filter.Def) => {
		return a.path > b.path ? 1 : 0;
	});
}

function test(done: (err?: any) => void, filterObj: filter.Filter, expected: filter.Def[]) {
	var out = new FSRepo(baseDir).getTree().pipe(getDefs()).pipe(filter(filterObj));

	streamTo(out, (err: any, arr: filter.Def[]) => {
		if (err) {
			done(err);
			return;
		}
		arr = sortDefs(arr);

		assert.deepEqual(arr, expected);

		done();
	});
}

describe('basics', () => {
	it('errors on bad filter', () => {
		assert.throw(() => {
			var stream = filter(null);
		}, /^filter must be an object/);
	});

	it('empty filter', (done) => {
		test(done, {}, [
			{ path: 'bar/bar-v1.2.3-alpha.d.ts',
				size: 7,
				project: 'bar',
				name: 'bar',
				semver: '1.2.3-alpha' },
			{ path: 'bar/bar.d.ts', size: 7, project: 'bar', name: 'bar' },
			{ path: 'bar/bazz.d.ts', size: 8, project: 'bar', name: 'bazz' },
			{ path: 'foo/foo-0.1.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.1.23' },
			{ path: 'foo/foo-0.2.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.2.23' },
			{ path: 'foo/foo.d.ts', size: 12, project: 'foo', name: 'foo' },
			{ path: 'hoge/hoge-ultra.fx.d.ts',
				size: 8,
				project: 'hoge',
				name: 'hoge-ultra.fx' }
		]);
	});
});

describe('name', () => {
	it('simple filter', (done) => {
		test(done, {
			name: 'foo'
		}, [
			{ path: 'foo/foo-0.1.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.1.23' },
			{ path: 'foo/foo-0.2.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.2.23' },
			{ path: 'foo/foo.d.ts', size: 12, project: 'foo', name: 'foo' }
		]);
	});

	it('glob name filter', (done) => {
		test(done, {
			name: 'ba*'
		}, [
			{ path: 'bar/bar-v1.2.3-alpha.d.ts',
				size: 7,
				project: 'bar',
				name: 'bar',
				semver: '1.2.3-alpha' },
			{ path: 'bar/bar.d.ts', size: 7, project: 'bar', name: 'bar' },
			{ path: 'bar/bazz.d.ts', size: 8, project: 'bar', name: 'bazz' }
		]);
	});
});

describe('project', () => {
	it('simple filter', (done) => {
		test(done, {
			name: 'bar'
		}, [
			{ path: 'bar/bar-v1.2.3-alpha.d.ts',
				size: 7,
				project: 'bar',
				name: 'bar',
				semver: '1.2.3-alpha' },
			{ path: 'bar/bar.d.ts', size: 7, project: 'bar', name: 'bar' }
		]);
	});
});

describe.only('semver', () => {
	it('greater then', (done) => {
		test(done, {
			name: 'foo',
			semver: '>=0.2'
		}, [
			{ path: 'foo/foo-0.2.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.2.23' },
			{ path: 'foo/foo.d.ts', size: 12, project: 'foo', name: 'foo' }
		]);
	});

	it('lesser then', (done) => {
		test(done, {
			name: 'foo',
			semver: '<0.2'
		}, [
			{ path: 'foo/foo-0.1.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.1.23' }
		]);
	});

	it('between then', (done) => {
		test(done, {
			name: 'foo',
			semver: '>=0.1 <0.2'
		}, [
			{ path: 'foo/foo-0.1.23.d.ts',
				size: 12,
				project: 'foo',
				name: 'foo',
				semver: '0.1.23' }
		]);
	});
});

