import serverConfig from '../_config/server';
import { generateErrorResult } from '../_helpers';

export default (req, res, next) => {
	if (req.cookies['back-dev-env'] !== serverConfig.cookiePassDev) {
		return generateErrorResult(req, 'Forbidden');
	}
	next();
};
