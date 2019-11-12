'use strict';

const path = require('path');
const babel = require('rollup-plugin-babel');
const svelte = require('rollup-plugin-svelte');
const babelCore = require('@babel/core');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'index.cjs.js',
			format: 'cjs',
			sourcemap: true
		},
		{
			file: 'index.esm.js',
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		svelte({
			legacy: true
		}),
		{
			async transform(code, id) {
				if (!id.includes('lib/index.svelte')) {
					return;
				}
				const result = await babelCore.transformAsync(code, {
					sourceMaps: true,
					plugins: []
				});
				return {
					code: result.code,
					map: result.map
				};
			}
		},
		babel({
			exclude: 'node_modules/**',
			extensions: ['.js', '.svelte']
		}),
		babel({
			include: 'node_modules/svelte/shared.js',
			runtimeHelpers: true,
			babelrc: false,
			configFile: path.resolve(__dirname, '.babelrc')
		}),
		resolve(),
		commonjs()
	],
	external: ['delegate-event-listener', 'dom-focus-lock']
};
