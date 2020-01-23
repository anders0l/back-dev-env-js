import path from 'path';
import webpack from 'webpack';

import pkg from '../package.json';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

if (isDev) {
	require('dotenv-safe').config({ allowEmptyValues: true });
}

export const reScript = /\.(js)$/;

console.log('Webpack mode: ', isDev ? 'development' : 'production');

module.exports = {
	name: 'server',
	entry: './src/server.js',

	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
		sourceMapFilename: '[file].map'
	},

	mode: isProduction || isTest ? 'production' : 'development',

	target: 'node',
	module: {
		// Make missing exports an error instead of warning
		strictExportPresence: true,

		rules: [
			{
				test: reScript,
				loader: 'babel-loader',
				include: [path.join(process.cwd(), 'src')],
				exclude: path.resolve('./node_modules'),
				options: {
					// https://github.com/babel/babel-loader#options
					cacheDirectory: isDev,

					// https://babeljs.io/docs/usage/options/
					babelrc: false,
					presets: [
						[
							'@babel/preset-env',
							{
								shippedProposals: true,
								...(isDev
									? {
											targets: {
												node: 'current'
											}
									  }
									: {
											forceAllTransforms: true, // for UglifyJS
											modules: false,
											useBuiltIns: false,
											debug: false
									  })
							}
						]
					],
					plugins: [
						[require('@babel/plugin-proposal-decorators'), { legacy: true }],
						['@babel/plugin-proposal-class-properties', { loose: true }]
					]
				}
			},
			{
				test: /\.json$/,
				exclude: /node_modules/,
				loader: 'json-loader'
			}
		]
	},

	plugins: [
		...(isDev
			? []
			: [
					// Decrease script evaluation time
					// https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
					new webpack.optimize.ModuleConcatenationPlugin(),
					// Minimize all JavaScript output of chunks
					// https://github.com/webpack-contrib/uglifyjs-webpack-plugin
					new UglifyJsPlugin({
						parallel: true,
						uglifyOptions: {
							ecma: 8
						}
					})
			  ])
	],

	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false
	},

	resolve: {
		modules: ['src', 'node_modules']
	},

	performance: {
		hints: false
	},

	stats: {
		colors: true,
		chunks: false,
		modules: false,
		reasons: false,
		children: false,
		source: false,
		publicPath: false
	},

	devtool: 'source-map'
};
