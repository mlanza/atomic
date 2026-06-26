# Bundling Explained

`npm run bundle` currently runs `rollup --config`, so the rollup configuration in `rollup.config.js` is the single source of truth for how the library and registry artifacts are produced. The config exports three vector-style builds (CLI bundle, tests bundle, and the `dist/atomic` bundle) that share the same feature flags and parsing helpers.

## Flags and feature gates

*(The rollup config still defines `_CROSSREALM`, `_EXPERIMENTAL`, and `_RELEASE` based on the presence of `--crossrealm`, `--experimental`, and `--release` CLI switches, but the prose below drops the underscore for readability.)*

These boolean flags are injected with `jscc` into the bundles so the code can toggle behavior without touching the source tree.

* **CROSSREALM** connects to the philosophy laid out in [Cross-realm operability](docs/cross-realm-operability.md). When the flag is truthy the build emits symbolic constructor metadata, which allows the library to recognize objects crossing frame or worker boundaries; keeping it falsy skips that work for single-realm scenarios.
* **EXPERIMENTAL** gates loading [`validates.js`](src/atomic/validates.js) (and the associated behaviors) inside the third build configuration so features that haven’t yet earned their permanent place stay optional. Passing `--experimental` to the CLI flips this switch inside `jscc`.
* **RELEASE** tells `terser` whether to compress the output. The plugin still runs either way, but `compress` only becomes truthy when `--release` is provided, so `npm run bundle -- --release` produces a production-compressed artifact while the default build remains readable for inspection.

## Parser setup

Rollup uses Acorn for parsing, and the codebase currently relies on Stage 3/4 syntax such as optional `catch { … }` bindings (e.g., `cleanlyN` in `src/atomic/core/index.js`). The built-in parser can’t parse those constructs, so the config injects `acorn-stage3` via `acornInjectPlugins: [stage3]`. This allows Rollup to understand the syntax without going through Babel.

## Plugins and their roles

| import | why it’s there |
|--------|----------------|
| `resolve` (`@rollup/plugin-node-resolve`) | Lets Rollup resolve bare imports (like `immutable` or `node_modules` packages) while building `dist/atomic`. Without it, Rollup can only bundle relative imports and would fail once we start reaching into `node_modules` for helpers.
| `json` (`@rollup/plugin-json`) | Enables importing JSON files. Some of the build steps (especially in the atomic modules) rely on config/data shipped as JSON, and Rollup can’t ingest that without the plugin.
| `jscc` (`rollup-plugin-jscc`) | Replaces occurrences of the `_EXPERIMENTAL`, `_CROSSREALM`, and `_RELEASE` constants at build time, allowing us to tree-shake entire feature branches based on the CLI flags.
| `replace` (`@rollup/plugin-replace`) | Rewrites imports that were written for environments with the `immutable` package so they point at the vendored `../immutable.js` file that lives alongside the bundled `dist/atomic` modules.
| `terser` (`rollup-plugin-terser`) | Minifies and beautifies the output when `_RELEASE` is truthy. The config now keeps the plugin at `^7.0.2` because Rollup 2.x cannot co-exist with the older `4.x` version that brings serious dependency conflicts (see the install history).
| `rollupImportMapPlugin` (`rollup-plugin-import-map`) | Writes an import map into the `dist/atomic` bundle so that intra-package imports such as `atomic/core` or `atomic/shell` resolve to the nearby `./core.js` files, which mirrors the layout that downstream consumers expect when they import from `./libs/atomic_`.
| `stage3` (`acorn-stage3`) | (Explained above) Allows Rollup’s parser to handle modern language features that the source already uses, so the build stays Babel-free.

## Philosophy

The goal here is simple: keep the workflow easy, keep maintenance short, and leave as few steps as possible between writing code and deploying it. That’s why `rollup` is absent from the day-to-day loop and is only invoked when a platform still lacks features we care about. The pipeline operator and partial application syntax proposals have been waiting at TC39 for years.

Ironically, the compromise is to run a build step whose only job is to help those who prefer to avoid them. The `dist/atomic/` folder is the raw output you can drop in and import directly, whereas `dist/atomic_/` reexports those modules via the `impart`/`partly` helpers so `_` (the core lib binding) doubles as the placeholder for partial application. That lets anyone who prefers the richer composition and pipelining experience do so without losing the “no build” promise. Rollup simply wires the wrappers together so consumers can pick the flavor that keeps their workflow as simple as possible.

Babel has often served as an early-access path to planned features like pipeline and partial application syntax. Because the proposals aren’t advancing and one can only speculate as to what they'll be, they're not worth coding today. Atomic's [alternative approach](docs/placeholder-partial.md) allows you to do tacit programming without a build step.
