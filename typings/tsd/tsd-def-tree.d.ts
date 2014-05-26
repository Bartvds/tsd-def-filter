/// <reference path="../node/node.d.ts" />

declare module 'tsd-def-tree' {
	import Repo = require('tsd-repo');

	class DefTree {
		repo: Repo;
		constructor(repo: Repo);
		getDefs(): NodeJS.ReadableStream;
	}

	export = DefTree;
}
