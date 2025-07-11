console.log('Loaded');
window.$eval = function (code) {
	return new Function(code)();
};
