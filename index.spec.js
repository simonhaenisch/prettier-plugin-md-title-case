// @ts-check

import test from 'ava';
import * as prettier from 'prettier';

/**
 * @param {string} code
 * @param {prettier.Options} [options]
 */
const prettify = async (code, options) =>
	prettier.format(code, {
		plugins: ['./index.js'],
		filepath: 'file.md',
		...options,
	});

test('converts headings to title case', async (t) => {
	const formattedCode = await prettify(
		'# test One\n\nlorem ipsum\n\n## test two',
	);

	t.is(formattedCode, '# Test One\n\nlorem ipsum\n\n## Test Two\n');
});

test('ignores additional # chars in the heading', async (t) => {
	const formattedCode = await prettify('### A heading with a # in it');

	t.is(formattedCode, '### A Heading with a # in It\n');
});

test('passes title-case options from the prettier config', async (t) => {
	const formattedCode = await prettify(
		'# some sentence - Only affects the first word!',
		{
			titleCase: JSON.stringify({ sentenceCase: true }),
		},
	);

	t.is(formattedCode, '# Some sentence - Only affects the first word!\n');
});
