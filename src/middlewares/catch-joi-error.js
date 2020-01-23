import { generateErrorResult } from '../_helpers';
import serverConfig from '../_config/server';

export default (err, req, res, next) => {
	if (err && err.joi) {
		err.joi.details.map(joiError => {
			let key = joiError.context.key;
			let value = joiError.context.value;
			if (key == 'password'
				|| key == 'newPassword'
				|| key == 'token'
			) {
				value = '<<HIDDEN>>';
			}
			console.error(`JOI Parameter validation error`,
				{
					request_data: `key: ${key}, value: ${value}`,
					url: req.url
				});
		});
		return generateErrorResult(req, res, 'BadParam', serverConfig.isDev ? err.stack : err.name); // full stacktrace on dev,
		// error name on prod
	} else {
		return next(err, req, res);
	}
};
