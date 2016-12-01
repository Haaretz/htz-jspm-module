module.exports = function(runner) {
	runner = runner ? runner : global;
	runner.expect = runner.chai.expect;

	beforeEach(function() {
		runner.sandbox = runner.sinon.sandbox.create();
		runner.stub = runner.sandbox.stub.bind(runner.sandbox);
		runner.spy = runner.sandbox.spy.bind(runner.sandbox);
		runner.mock = runner.sandbox.mock.bind(runner.sandbox);
		runner.useFakeTimers = runner.sandbox.useFakeTimers.bind(runner.sandbox);
		runner.useFakeXMLHttpRequest = runner.sandbox.useFakeXMLHttpRequest.bind(runner.sandbox);
		runner.useFakeServer = runner.sandbox.useFakeServer.bind(runner.sandbox);
	});

	afterEach(function() {
		delete runner.stub;
		delete runner.spy;
		runner.sandbox.restore();
	});
};
