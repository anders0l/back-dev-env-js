export default (req, res, next) => {
	const startTime = process.hrtime();
	const send = res.send.bind(res);
	res.send = (...args) => {
		const totalTime = process.hrtime(startTime);
		const totalTimeInMs = (totalTime[0] * 1e9 + totalTime[1]) / 1e6;

		res.header({
			'Server-Timing': `handle=${totalTimeInMs}; "Total time to handle request"`
		});

		send(...args);
	};

	next();
};
