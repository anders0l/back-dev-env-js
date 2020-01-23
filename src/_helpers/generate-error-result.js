import httpCodeErrors from './http-code-errors';
import serverName from './get-server-name';

export default (req, res, type, stackTrace) => {
	const error = httpCodeErrors(type, serverName);
	if (error.code != 404) {
		const logingError = error;
		if (stackTrace) {
			logingError.stackTrace = typeof stackTrace === 'object' ? JSON.stringify(stackTrace) : stackTrace;
		}
		// To-Do: this is temporary, not always
		// console.error(logingError);
	}
	return res.status(error.code).json(error);
};
