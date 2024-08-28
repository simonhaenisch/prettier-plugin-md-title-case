[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/simonhaenisch/prettier-plugin-md-title-case/test.yml?label=CI)](https://github.com/simonhaenisch/prettier-plugin-md-title-case/actions?query=branch%3Amaster)

# Prettier Plugin: Markdown Title Case

> Make sure that your Markdown headings stay consistent no matter who writes them.

A plugin that makes Prettier convert your markdown headings to title case using the [title-case](https://npmjs.com/packages/title-case) npm package.

**Features**

- 🚀 Zero config (but configurable).
- 🤓 No more inconsistent headings.
- 🤙 No more fixing other people's titles.

**Caveat**

This plugin overrides the built-in Prettier parser for `markdown`. This means that it is incompatible with other plugins that do the same; only the last loaded plugin that exports one of those parsers will function.

## Installation

```sh
npm install --save-dev prettier-plugin-md-title-case
```

_Note that `prettier` is a peer dependency, so make sure you have it installed in your project. Prettier 2 is not supported as this package is written with ESM syntax._

## Usage

Configure Prettier to use the plugin according to the [Plugins docs](https://prettier.io/docs/en/plugins.html), for example by adding it to the `plugins` config:

```js
// prettier.config.js

/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-md-title-case'],
};
```

It doesn't support inline HTML headings.

## Configuration

You can pass the supported options of `title-case` (see [npmjs.com/package/title-case#options](https://www.npmjs.com/package/title-case#options)) to your Prettier config as a JSON-stringified object via the `titleCase` option.

```js
// prettier.config.js

/** @type {import('title-case').Options} */
const titleCaseOptions = { locale: 'en_US' };

/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-md-title-case'],
  titleCase: JSON.stringify(titleCaseOptions),
};
```

## Debug Logs

If it doesn't work, you can try to prefix your `prettier` command with `DEBUG=true` (or any truthy value) which will make this plugin print runtime exception logs.

## Rationale/Disclaimer

This plugin acts outside of [Prettier's scope](https://prettier.io/docs/en/rationale#what-prettier-is-_not_-concerned-about) because _"Prettier only prints code. It does not transform it."_, and technically converting the case is a code transformation. In my opinion however, Markdown is just markup and not really code, and it doesn't change the AST of the Markdown file (just the content of some text node values). Therefore the practical benefits outweigh sticking with the philosophy in this case.

## License

[MIT](/license).
