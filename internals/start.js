import webpack from 'webpack';
import serverConfig from './webpack.babel';

import runServer from './runServer'
import run from './run'

/**
 * Creates application bundles from the source files.
 */
function start() {
	return new Promise((resolve, reject) => {
		webpack(serverConfig).watch(300, (err, stats) => {
			if (err) {
				return reject(err);
			}

			console.info(stats.toString({
				colors: true,
				chunks: false,
				modules: false,
				reasons: false,
				children: false,
				source: false,
				publicPath: false,
			}));
			if (stats.hasErrors()) {
				return reject(new Error('Webpack compilation errors'));
			}

			run(runServer);

			return resolve();
		});
	});
}

export default start;
