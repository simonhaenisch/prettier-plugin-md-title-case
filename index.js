/// <reference types="./index.d.ts" />
// @ts-check

import { parsers } from 'prettier/plugins/markdown';
import { titleCase } from 'title-case';

/**
 * Set `convertHeadingsToTitleCase` as the given parser's `preprocess` hook, or merge it with the existing one.
 *
 * @param {import('prettier').Parser} parser prettier parser
 */
const withTitleCasePreprocess = (parser) => {
	return {
		...parser,
		/**
		 * @param {string} code
		 * @param {import('prettier').ParserOptions} options
		 */
		preprocess: (code, options) =>
			convertHeadingsToTitleCase(
				parser.preprocess ? parser.preprocess(code, options) : code,
				options,
			),
	};
};

/**
 * Convert all headings to title case using the `title-case` package.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
const convertHeadingsToTitleCase = (code, options) => {
	try {
		const titleCaseOptions = options.titleCase
			? JSON.parse(options.titleCase)
			: undefined;

		return code
			.split('\n')
			.map((line) => {
				if (!line.startsWith('#')) {
					return line;
				}

				const content = line.replace(/^#+/, '').trim();

				const inlineCodeMatches = Array.from(content.matchAll(/`.+?`/g));

				let newContent = titleCase(content, titleCaseOptions);

				for (const match of inlineCodeMatches) {
					const [inlineCode] = match;

					newContent =
						newContent.slice(0, match.index) +
						inlineCode +
						newContent.slice(match.index + inlineCode.length);
				}

				return line.replace(content, newContent);
			})
			.join('\n');
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
};

/**
 * @type {import('prettier').Plugin}
 */
export default {
	options: {
		titleCase: {
			type: 'string',
			default: undefined,
			category: 'TitleCase',
			description:
				'JSON-stringified object with options for the `title-case` package.',
		},
	},
	parsers: {
		markdown: withTitleCasePreprocess(parsers.markdown),
	},
};
