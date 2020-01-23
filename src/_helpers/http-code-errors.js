const errorsMessages = [
	{
		// fallback - use it only when you can't really understand what's happen
		//  and how to processed with request
		code: 400,
		type: 'BadRequest',
		message: 'Invalid request'
	}, {
		// if some parameter is not valid. Like we expect number, but get string or undefind.
		// in this case we don't send which parameter in invalid
		code: 400,
		type: 'BadParam',
		message: 'Invalid parameter in request'
	}, {
		// if some body is empty, but we expect something inside
		code: 400,
		type: 'EmptyBody',
		message: 'Request body not specified'
	}, {
		// mostly we need user_id in request. If it's missing we must tell about it
		code: 400,
		type: 'UserIdMissing',
		message: 'User ID is required'
	}, {
		// all requests from front must to have propper X-Request-ID header
		code: 400,
		type: 'BadRequestId',
		message: 'Invalid request'
	}, {
		// it's custom error, as we don't want to show outside error details
		// use it only when you get ConditionalCheckFailedException from dynamoose
		code: 400,
		type: 'ConditionalCheckFailedException',
		message: 'The conditional request failed'
	}, {
		// it's custom error, as we don't want to show outside error details
		// use it only when you get InvalidParameterType from dynamoose
		code: 400,
		type: 'InvalidParameterType',
		message: 'Wrong parameter type provided'
	}, {
		code: 400,
		type: 'TemplateMissing',
		message: 'Template not exist'
	}, {
		// only for AUTH server
		code: 400,
		type: 'InsecurePassword',
		message: 'Provided password does not meet minimum security requirements'
	}, {
		// only for PostgreSQL
		code: 400,
		type: 'DuplicateFieldError',
		message: 'The field you passed already has in table'
	}, {
		// only for PostgreSQL
		code: 400,
		type: 'InvalidDateFormatError',
		message: 'You passed wrong Date format'
	}, {
		// only for PostgreSQL
		code: 400,
		type: 'NonNullFieldError',
		message: 'The field you passed should not be null, but you passed null'
	}, {
		// fallback for all requests, except GET. If GET, please use 302 redirect to auth page
		code: 401,
		type: 'Unauthorized',
		message: 'This resource requires authentication'
	}, {
		code: 401,
		type: 'TokenExpired',
		message: 'Token expired'
	}, {
		code: 401,
		type: 'EmptyJWTToken',
		message: 'Can\'t find JWT token inside the request header'
	}, {
		code: 401,
		type: 'BadJWTToken',
		message: 'Invalid JWT token'
	}, {
		// only for AUTH server
		// fallback - use it only when you can't really understand what's happen with AUTH
		code: 401,
		type: 'AuthFailure',
		message: 'Missing or Invalid credentials'
	}, {
		// only for AUTH server
		code: 401,
		type: 'ResetKeyExpired',
		message: 'Password reset key expired'
	}, {
		// fallback - if JWT token is valid, user is authenticated, but we can't tell why it's forbidden
		code: 403,
		type: 'Forbidden',
		message: 'Access denied'
	}, {
		code: 403,
		type: 'WrongRole',
		message: 'Access denied for this role'
	}, {
		code: 403,
		type: 'NotActivated',
		message: 'Your account is not activated'
	}, {
		code: 403,
		type: 'Blocked',
		message: 'Your account is currently blocked'
	}, {
		code: 404,
		type: 'NotFound',
		message: 'Resource not found'
	}, {
		code: 408,
		type: 'Timeout',
		message: 'Request Timeout'
	}, {
		code: 409,
		type: 'AlreadyRegistered',
		message: 'User is already registered'
	}, {
		code: 409,
		type: 'SlugAlreadyTaken',
		message: 'Slug is already taken'
	}, {
		code: 409,
		type: 'AlreadyVerified',
		message: 'Email is already verified'
	}, {
		code: 409,
		type: 'AlreadyDone',
		message: 'This action is already happened'
	}, {
		code: 409,
		type: 'AlreadyExists',
		message: 'This record is already exists'
	}, {
		code: 500,
		type: 'UnexpectedError',
		message: 'Unexpected error occured'
	}, {
		code: 500,
		type: 'ServerError',
		message: 'Unexpected error occured'
	}, {
		code: 500,
		type: 'DatabaseError',
		message: 'Unexpected error occured'
	}, {
		// only for GraphQL
		// when REST server respond with 500 ERROR (or without type), so it don't understand what's happen.
		// otherwise please proxy an error from server
		code: 502,
		type: 'GraphqlBadGateway',
		message: 'Оne of the servers respond with 500 error'
	}, {
		// only for GraphQL
		code: 504,
		type: 'GraphqlGatewayTimeout',
		message: 'GraphQL gateway timeout'
	}
];

const addServiceInfo = (data) => {
	data.time = new Date().toISOString();
	return data;
};

const undefinedError = () => {
	console.error('HTTP CODE ERROR SERVER', 'There is no such error type');
	return {
		code: 500,
		type: 'UndefinedError',
		message: 'Unexpected error occured'
	};
};

export default (type, id, serverName) => {
	let formatedMessage;
	if (type === undefined) {
		formatedMessage = undefinedError();
	} else {
		formatedMessage = errorsMessages.find(x => x && x.type === type);
		if (!formatedMessage) {
			formatedMessage = undefinedError();
		}
	}
	formatedMessage.id = id;
	formatedMessage.serverName = serverName; // can be undefined
	return addServiceInfo(formatedMessage);
};
