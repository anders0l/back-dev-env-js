export default {
	isDev: process.env.NODE_ENV === 'development',
	idProd: process.env.NODE_ENV === 'production',
	responseTimeout: 10 * 1000,
	port: process.env.SERVER_PORT || 3000,
	serverName: process.env.SERVER_NAME || 'back-dev-env-admin-back',
	cookiePassDev: 'vBtLDZt6vsDhnUbT8' // hardcode it here only for example
};
