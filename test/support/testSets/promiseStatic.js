/*
 * cls-bluebird tests
 * Utilities
 * Functions to run a set of tests relating to testing that static methods return a promise of correct type.
 * Mixin to Utils prototype.
 */

/* global describe */

// Exports

module.exports = {
	/**
	 * Run set of tests on a static method which receives a value to ensure always returns a promise
	 * inherited from correct Promise constructor.
	 *
	 * Test function `fn` is called with a `value`.
	 * `fn` should call the method being tested with `value`, and return resulting promise.
	 * e.g. `return Promise.resolve(value)`
	 *
	 * A different `value` is provided in each test:
	 *   - literal value
	 *   - undefined
	 *   - promise from various constructors, resolved or rejected, sync or async
	 *
	 * @param {Function} fn - Test function
	 * @returns {undefined}
	 */
	testSetReturnsPromiseStaticReceivingValue: function(fn) {
		var u = this;
		describe('returns instance of patched Promise constructor when passed', function() {
			u.describeValues(function(makeValue) {
				u.testIsPromise(function(cb) {
					var value = makeValue();
					var p = fn(value);
					u.inheritRejectStatus(p, value);
					cb(p);
				});
			});
		});
	},

	/**
	 * Run set of tests on a static method which receives a handler to ensure always returns a promise
	 * inherited from correct Promise constructor.
	 *
	 * Test function `fn` is called with a function `handler`.
	 * `fn` should call the method being tested with `handler`, and return resulting promise.
	 * e.g. `return Promise.try(handler)`
	 *
	 * A different `handler` is provided in each test, which returns:
	 *   - literal value
	 *   - undefined
	 *   - thrown error
	 *   - promise from various constructors, resolved or rejected, sync or async
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} options - Options object
	 * @param {boolean} options.noUndefined - true if method does not accept undefined handler
	 * @returns {undefined}
	 */
	testSetReturnsPromiseStaticReceivingHandler: function(fn, options) {
		var u = this;
		describe('returns instance of patched Promise constructor when callback', function() {
			// Test undefined handler
			if (!options.noUndefined) {
				u.test('is undefined', function(t) {
					var p = fn(undefined);

					t.error(u.checkIsPromise(p));
					t.done(p);
				});
			}

			// Test handlers
			u.describeHandlers(function(handler) {
				u.testIsPromiseFromHandler(function(handler, cb) {
					var p = fn(handler);
					u.inheritRejectStatus(p, handler);
					cb(p);
				}, handler);
			});
		});
	},

	/**
	 * Run set of tests on a static method that takes an array (not promise of an array)
	 * to ensure always returns a promise inherited from correct Promise constructor.
	 *
	 * Test function `fn` is called with an `array`.
	 * `fn` should call the method being tested with `array`, and return resulting promise.
	 * e.g. `return Promise.join.apply(Promise, array)`
	 *
	 * A different `array` is provided in each test, containing members:
	 *   - literal value
	 *   - undefined
	 *   - promises of different types, resolved or rejected, sync or async
	 *
	 * If `options.noUndefined` is not true, a test is included for an undefined array.
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} [options] - Options object
	 * @param {boolean} [options.noUndefined=false] - true if method does not accept undefined value
	 * @returns {undefined}
	 */
	testSetReturnsPromiseStaticReceivingArrayLiteral: function(fn, options) {
		var u = this;
		options = options || {};

		describe('returns instance of patched Promise constructor when passed', function() {
			u.describeArrays(function(makeValue) {
				u.testIsPromise(function(cb) {
					var value = makeValue();
					var p = fn(value);
					u.inheritRejectStatus(p, value);
					cb(p);
				});
			}, options);
		});
	},

	/**
	 * Run set of tests on a static method that takes an array or promise of an array
	 * to ensure always returns a promise inherited from correct Promise constructor.
	 *
	 * Test function `fn` is called with a `value`.
	 * `fn` should call the method being tested with `value`, and return resulting promise.
	 * e.g. `return Promise.all(value)`
	 *
	 * A different `value` is provided in each test:
	 *   - undefined
	 *   - array
	 *   - promises of different types
	 *     - resolved sync or async with
	 *       - undefined
	 *       - array
	 *     - rejected sync or async with error
	 *
	 * Arrays can have members:
	 *   - literal value
	 *   - undefined
	 *   - promises of different types, resolved or rejected, sync or async
	 *
	 * If `options.noUndefined` is true, tests for undefined value and promises of undefined are skipped.
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} [options] - Options object
	 * @param {boolean} [options.noUndefined=false] - true if method does not accept undefined value
	 * @returns {undefined}
	 */
	testSetReturnsPromiseStaticReceivingArray: function(fn, options) {
		var u = this;
		options = options || {};

		describe('returns instance of patched Promise constructor when passed', function() {
			u.describeArrayOrPromiseOfArrays(function(makeValue) {
				u.testIsPromise(function(cb) {
					var value = makeValue();
					var p = fn(value);
					u.inheritRejectStatus(p, value);
					cb(p);
				});
			}, options);
		});
	},

	/**
	 * Run set of tests on a static method that takes an array or promise of an array and a handler
	 * to ensure always returns a promise inherited from correct Promise constructor.
	 *
	 * Test function `fn` is called with a `value` and a `handler`.
	 * `fn` should call the method being tested with `value`, attaching `handler` and return resulting promise.
	 * e.g. `return Promise.map(value, handler)`
	 *
	 * A different `value` is provided in each test:
	 *   - undefined
	 *   - array
	 *   - promises of different types
	 *     - resolved sync or async with
	 *       - undefined
	 *       - array
	 *     - rejected sync or async with error
	 *
	 * Arrays can have members:
	 *   - literal value
	 *   - undefined
	 *   - promises of different types, resolved or rejected, sync or async
	 *
	 * If `options.noUndefined` is true, tests for undefined value and promises of undefined are skipped.
	 *
	 * Handlers return a resolved/rejected sync/asyc promise, literal value, undefined, or throw.
	 *
	 * @param {Function} fn - Test function
	 * @param {Object} options - Options object
	 * @param {boolean} [options.continues=false] - true if handler fires on resolved promise
	 * @param {boolean} [options.catches=false] - true if handler fires rejected promise
	 * @param {boolean} [options.noUndefinedValue=false] - true if method does not accept undefined value
	 * @param {boolean} [options.noUndefinedHandler=false] - true if method does not accept undefined handler
	 * @returns {undefined}
	 */
	testSetReturnsPromiseStaticReceivingArrayAndHandler: function(fn, options) {
		var u = this;

		describe('returns instance of patched Promise constructor when passed', function() {
			u.describeArrayOrPromiseOfArrays(function(makeValue) {
				describe('and handler', function() {
					// Test undefined handler
					if (!options.noUndefinedHandler) {
						u.test('is undefined', function(t) {
							var value = makeValue();
							var p = fn(value, undefined);
							u.inheritRejectStatus(p, value);

							t.error(u.checkIsPromise(p));
							t.done(p);
						});
					}

					// If handler should not be fired on this promise, check is not fired
					var handlerShouldBeCalled = u.getRejectStatus(makeValue) ? options.catches : options.continues;

					if (!handlerShouldBeCalled) {
						describe('is ignored', function() {
							u.testIsPromiseFromHandler(function(handler, cb) {
								var value = makeValue();

								// Workaround for bug in bluebird v2 where a non-bluebird 2 promise
								// which is rejected synchronously results in an unhandled rejection
								// on `Promise.map()`.
								// TODO Remove this when bug is fixed
								// TODO Check this is required for methods other than `Promise.map()`
								if (u.bluebirdVersion === 2 && (u.isBluebirdPromise(value) ? value.constructor.version.slice(0, 2) !== '2.' : true) && u.getRejectStatus(value) && u.isPromise(value) && !makeValue._array && !makeValue._async) u.suppressUnhandledRejections(value);

								var p = fn(value, handler);
								u.inheritRejectStatus(p, value);
								cb(p);
							}, undefined, {expectedCalls: 0});
						});
						return;
					}

					// Handler should fire on this value
					// Test all handlers
					u.describeHandlers(function(handler) {
						var oneCall = handler._throws || (
							u.getRejectStatus(handler)
							&& handler._constructor === u.Promise
							&& !handler._async
						);

						u.testIsPromiseFromHandler(function(handler, cb) {
							var value = makeValue();
							var p = fn(value, handler);
							u.inheritRejectStatus(p, handler);
							cb(p);
						}, handler, {expectedCalls: oneCall ? 1 : 3});
					});
				});
			}, {noUndefined: options.noUndefinedValue});
		});
	}
};
