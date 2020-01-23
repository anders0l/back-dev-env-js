import { generateErrorResult } from '../_helpers';

export default (err, req, res, next) => {
	if (req.timedout) {
		return generateErrorResult(req, res, 'Timeout');
	}
	next();
};
