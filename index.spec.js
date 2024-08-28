// @ts-check

import it from 'ava';
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

it('converts headings to title case', async (t) => {
	const formattedCode = await prettify(
		'# test One\n\nlorem ipsum\n\n## test two',
	);

	t.is(formattedCode, '# Test One\n\nlorem ipsum\n\n## Test Two\n');
});

it('ignores additional # chars in the heading', async (t) => {
	const formattedCode = await prettify('### A heading with a # in it');

	t.is(formattedCode, '### A Heading with a # in It\n');
});

it('does not convert inline code', async (t) => {
	const formattedCode = await prettify('# heading with `inline-code` in it');

	t.is(formattedCode, '# Heading with `inline-code` in It\n');
});

it('does not convert multiple inline code fragments', async (t) => {
	const formattedCode = await prettify(
		'# heading with `inline-code` but `twice`',
	);

	t.is(formattedCode, '# Heading with `inline-code` but `twice`\n');
});

it('leaves inline code intact when the same code is used multiple times', async (t) => {
	const formattedCode = await prettify(
		'# heading with same `inline-code` twice `inline-code`',
	);

	t.is(
		formattedCode,
		'# Heading with Same `inline-code` Twice `inline-code`\n',
	);
});

it('passes title-case options from the prettier config', async (t) => {
	const formattedCode = await prettify(
		'# some sentence - Only affects the first word!',
		{
			titleCase: JSON.stringify({ sentenceCase: true }),
		},
	);

	t.is(formattedCode, '# Some sentence - Only affects the first word!\n');
});

const fullExample = `
# foo bar \`inline-code\` baz

lorem ipsum

\`\`\`yaml
# some yaml comment
foo: bar
\`\`\`

## heading two
`.trimStart();

const fullExampleExpected = `
# Foo Bar \`inline-code\` Baz

lorem ipsum

\`\`\`yaml
# some yaml comment
foo: bar
\`\`\`

## Heading Two
`.trimStart();

it('works with the full example', async (t) => {
	const formattedCode = await prettify(fullExample);

	t.is(formattedCode, fullExampleExpected);
});
