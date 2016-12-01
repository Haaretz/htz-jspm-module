window.mocha.setup('bdd');
window.onload = function() {
  window.mocha.checkLeaks();
  window.mocha.globals(Object.keys({
	  'expect': true,
	  'mock': true,
	  'sandbox': true,
	  'spy': true,
	  'stub': true,
	  'useFakeServer': true,
	  'useFakeTimers': true,
	  'useFakeXMLHttpRequest': true
  }));
  window.mocha.run();
  require('./setup')(window);
};
