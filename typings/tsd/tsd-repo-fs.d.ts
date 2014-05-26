/// <reference path="../node/node.d.ts" />
/// <reference path="../tsd/tsd-repo.d.ts" />

declare module 'tsd-repo-fs' {
	import Repo = require('tsd-repo');
	class FSRepo implements Repo {
		dir: string;

		constructor(dir: string);

		getTree(): NodeJS.ReadableStream;
		getBlob(file: string): NodeJS.ReadableStream;
		getHistory(file: string): NodeJS.ReadableStream;
	}
	export = FSRepo;
}
