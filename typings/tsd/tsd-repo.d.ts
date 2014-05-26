/// <reference path="../node/node.d.ts" />

declare module 'tsd-repo' {
	interface Repo {
		getTree(): NodeJS.ReadableStream;
		getBlob(file: string): NodeJS.ReadableStream;
		getHistory(file: string): NodeJS.ReadableStream;
	}
	export = Repo;
}
