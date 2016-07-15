/*
 * cls-bluebird tests
 * Utilities
 * Functions to run a set of tests relating to testing that callbacks have been bound to CLS context.
 * Mixin to Utils prototype.
 */

/* global describe */

// Exports

module.exports = {
	/**
	 * Run set of tests on a prototype method to ensure callback is always bound to CLS context.
	 * Function `fn` should take provided `promise` and call the method being tested on it.
	 * `fn` is called with a `promise` and a `handler` function which should be attached as the callback to the method under test.
	 * e.g. `return promise.then(handler)`
	 *
	 * If handler is being attached to catch rejections, `options.catches` should be `true`
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} options - Options object
	 * @param {boolean} options.continues - true if handler fires on resolved promise
	 * @param {boolean} options.catches - true if handler fires on rejected promise
	 * @param {boolean} options.passThrough - true if method passes through errors even if handler fires
	 * @param {Function} [options.handler] - Handler function
	 * @returns {undefined}
	 */
	testSetBoundProto: function(fn, options) {
		var u = this;
		describe('binds callback on a promise', function() {
			u.describeMainPromisesAttach(function(makePromise, attach) {
				var handlerShouldBeCalled = u.getRejectStatus(makePromise) ? options.catches : options.continues;
				var expectedCalls = handlerShouldBeCalled ? 1 : 0;

				u.testBound(function(handler, p, cb) {
					attach(function() {
						var newP = fn(p, handler);
						if (options.passThrough || !handlerShouldBeCalled) u.inheritRejectStatus(newP, p);
						cb(newP);
					}, p);
				}, makePromise, options.handler, {expectedCalls: expectedCalls});
			});
		});
	},

	/**
	 * Run set of tests on a static method to ensure callback is never bound to CLS context.
	 * Function `fn` should call the method being tested, attaching `handler` as the callback.
	 * e.g. `return Promise.try(handler)`
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} [options] - Options object
	 * @param {Function} [options.handler] - Optional handler function
	 * @returns {undefined}
	 */
	testSetNotBoundStatic: function(fn, options) {
		var u = this;
		options = options || {};

		describe('does not bind callback', function() {
			u.testNotBound(function(handler) {
				return fn(handler);
			}, options.handler);
		});
	}
};
