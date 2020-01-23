const CONSOLE_FONT_COLOR_RED = `\x1b[31m`;
const CONSOLE_FONT_COLOR_YELLOW = `\x1b[33m`;
const CONSOLE_FONT_COLOR_DEBUG = `\x1b[34m`;
const CONSOLE_FONT_COLOR_GREEN = `\x1b[32m`;
const CONSOLE_RESET = `\x1b[0m`;

const log = (message, color = CONSOLE_RESET) => {
	console.log(color, message, CONSOLE_RESET);
};

const warn = (message) => {
	log(message, CONSOLE_FONT_COLOR_YELLOW, CONSOLE_RESET);
};

const error = (message) => {
	log(message, CONSOLE_FONT_COLOR_RED, CONSOLE_RESET);
};

const debug = (message) => {
	log(message, CONSOLE_FONT_COLOR_DEBUG, CONSOLE_RESET);
};

const done = (message) => {
	log(message, CONSOLE_FONT_COLOR_GREEN, CONSOLE_RESET);
};

export default {
	log,
	warn,
	error,
	debug,
	done
};
