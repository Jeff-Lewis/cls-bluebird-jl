/*
 * cls-bluebird tests
 * Tests for .catch() / .error()
 */

/* global describe, it */

// Modules
var expect = require('chai').expect;

// Imports
var runTests = require('../support');

// Run tests

runTests('.catch()', function(u) {
    describe('with 1st arg', function() {
        u.testSetProtoMethodAsync(function(p, handler) {
            return p.catch(handler);
        }, {catches: true});
    });

    describe('with 2nd arg', function() {
        u.testSetProtoMethodAsync(function(p, handler) {
            return p.catch(Error, handler);
        }, {catches: true, noUndefined: true, noBind: (u.bluebirdVersion === 3)});
    });
});

runTests('.caught()', function(u, Promise) { // jshint ignore:line
    it('is alias of .catch()', function() {
        expect(Promise.prototype.caught).to.equal(Promise.prototype.catch);
    });
});

/*
// TODO make this work - .error() only catches operational errors
runTests('.error()', function(u) {
    u.testSetProtoMethodAsync(function(p, handler) {
        return p.error(handler);
    }, {catches: true});
});
*/