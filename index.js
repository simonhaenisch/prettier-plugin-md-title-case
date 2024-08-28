/// <reference types="./index.d.ts" />
// @ts-check

import { parsers } from 'prettier/plugins/markdown';
import { titleCase } from 'title-case';

/**
 * Call the given parser to get the AST, then convert the text values of all heading tokens to title-case.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 * @param {import('prettier').Parser} parser
 */
async function parseWithHeadingsToTitleCase(code, options, parser) {
	const titleCaseOptions = options.titleCase
		? JSON.parse(options.titleCase)
		: undefined;

	const ast = await parser.parse(code, options);

	const headings = ast.children.filter((token) => token.type === 'heading');

	for (const heading of headings) {
		const textTokens = heading.children.filter(
			(token) => token.type === 'text',
		);

		const text = textTokens.map((token) => token.value).join('');

		let converted = titleCase(text, titleCaseOptions);

		textTokens.forEach((token) => {
			token.value = converted.slice(0, token.value.length);
			converted = converted.slice(token.value.length);
		});
	}

	return ast;
}

/**
 * Patch the `parse` method of the given parser to use `parseWithHeadingsToTitleCase` instead which wraps the given parser.
 *
 * @param {import('prettier').Parser} parser
 *
 * @returns {import('prettier').Parser}
 */
function withPatchedParse(parser) {
	return {
		...parser,
		parse: (code, options) =>
			parseWithHeadingsToTitleCase(code, options, parser),
	};
}

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
		markdown: withPatchedParse(parsers.markdown),
	},
};
