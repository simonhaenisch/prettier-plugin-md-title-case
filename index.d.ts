import type { Plugin } from 'prettier';

/**
 * Declaration merging for the `prettier` module.
 */
declare module 'prettier' {
	export interface Options {
		titleCase?: string;
	}

	export interface ParserOptions {
		titleCase?: string;
	}
}

declare const plugin: Plugin;
export default plugin;
