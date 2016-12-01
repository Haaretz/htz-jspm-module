global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-as-promised'));

if (!global.document || !global.window) {
	// Setup the jsdom environment
	// @see https://github.com/facebook/react/issues/5046
	const jsdom = require('jsdom').jsdom;

	var doc = jsdom('<!DOCTYPE html><html><body></body></html>');

	// get the window object out of the document
	var win = doc.defaultView;

	// set globals for mocha that make access to document and window feel
	// natural in the test environment
	global.document = doc;
	global.window = win;

	//JSDOM doesn't support localStorage by default, so lets just fake it..
	if (!global.window.localStorage) {
		global.window.localStorage = {
			getItem() { return '{}'; },
			setItem() {}
		};
	}

	// take all properties of the window object and also attach it to the
	// mocha global object
	propagateToGlobal(win);

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
	function propagateToGlobal (window) {
		for (var key in window) {
			if (!window.hasOwnProperty(key)) continue;
			if (key in global) continue;

			global[key] = window[key];
		}
	}
}

require('./setup')();
