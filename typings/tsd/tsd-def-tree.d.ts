/// <reference path="../node/node.d.ts" />

declare module 'tsd-def-tree' {
	import Repo = require('tsd-repo');

	function getDefs(): NodeJS.ReadWriteStream;

	export = getDefs;
}
