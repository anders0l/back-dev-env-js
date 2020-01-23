import '@babel/polyfill';
import express from 'express';
import connectTimeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import serverConfig from './_config/server';
import serverTiming from './middlewares/server-timing';
import catchJoiError from './middlewares/catch-joi-error';
import catchTimeoutError from './middlewares/catch-timeout-error';
import { generateErrorResult, console } from './_helpers';

const app = express();
// -----------------------------------------------------------------------------
// Import server routes
// -----------------------------------------------------------------------------
import routeSomeRoute from './routes/SomeRoute/';
// -----------------------------------------------------------------------------
// Setup express server
// -----------------------------------------------------------------------------
app.set('trust proxy', 1);
app.disable('etag');
app.disable('x-powered-by');
// -----------------------------------------------------------------------------
// Register express middleware
// -----------------------------------------------------------------------------
app.use(serverTiming);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsWhitelist = ['http://localhost:3200'];
const corsOptions = {
	exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
	credentials: true,
	origin: (origin, callback) => {
		// if (serverConfig.isDev) {
		// TODO: this for LOCAL TEST only
		// temporary expose at live
		return callback(null, true);
		// }
		// eslint-disable-next-line no-unreachable
		if (corsWhitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};
app.options('*', cors(corsOptions));
// this timeout doesn't stop any node operations. You must handle it by yourself
app.use(connectTimeout(serverConfig.responseTimeout));
app.set('json spaces', 40);
// -----------------------------------------------------------------------------
// Setup maintenance routes
// -----------------------------------------------------------------------------
app.get('/', (req, res) => {
	res.send('OK');
});
app.get('/healthcheck', (req, res) => {
	res.send('OK');
});
// -----------------------------------------------------------------------------
// Setup server routes with use
// -----------------------------------------------------------------------------
app.use('/someroute', cors(corsOptions), routeSomeRoute);
// -----------------------------------------------------------------------------
// Catch Celebrate & Joi errors
// -----------------------------------------------------------------------------
app.use(catchJoiError);
// -----------------------------------------------------------------------------
// Catch timeout error
// -----------------------------------------------------------------------------
app.use(catchTimeoutError);
// -----------------------------------------------------------------------------
// Catch unresolved errors
// -----------------------------------------------------------------------------
// 404 error
app.all('*', (req, res) => {
	generateErrorResult(req, res, 'NotFound');
});
// development error handler
// will print stacktrace
if (serverConfig.isDev) { // we setup it in docker-compose
	// we need add next to make it work properly
	app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
		const httpCode = err.status || err.code || 500;
		if ((httpCode >= 400 && httpCode < 600) && httpCode != 404) {
			console.error(err);
		}
		res.status(httpCode);
		res.send(JSON.stringify({ error: err }, null, '\t'));
	});
}
// production error handler
// no stacktraces leaked to user
// we need add next to make it work properly
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
	res.status(err.status || err.code || 500);
	res.send(err.message || '500: Internal Server Error');
});

// Launch the server (NOTE: Must be sync with option in internals/runServer.js)
app.listen(serverConfig.port, () => {
	console.warn(`The server is running at http://localhost:${serverConfig.port}/`); // eslint-disable-line no-console
});

process.on('unhandledRejection', err => {
	console.error('Node Error: Unhandled Rejection', {
		text: err.text,
		stack_trace: err.stack
	});
});

export default app;
