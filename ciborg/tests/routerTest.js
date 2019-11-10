'use strict'

const assert = require('assert');

describe('Router Test', function () {
    it('Simple Get', function() {
        // [A]rrange
        const router = require('../router');
        router.get('/hello/world', function (req, res) {
            res.result = 200;
        });
        const req = { method: 'GET', url: '/hello/world' };
        const res = { };

        // [A]ct
        router(req, res);

        //[A]ssert
        assert.equal(res.result, 200);
    });

    it('Get with variable url', function() {
        // [A]rrange
        const router = require('../router');
        router.get('/hello/world/:id', function (req, res) {
            res.result = 200;
        });
        const req = { method: 'GET', url: '/hello/world/20' };
        const res = { };

        // [A]ct
        router(req, res);

        // [A]ssert
        assert.equal(res.result, 200);
        assert.equal(req.routerParameters.id, '20');
    });
});