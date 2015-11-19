'use strict';

var Memcached = require('memcached');
var Promise = require('bluebird');

var memcachedUri = process.env.TWEETDEX_MEMCACHED_URI || '127.0.0.1:11211';
var memcached = Promise.promisifyAll(new Memcached(memcachedUri));

module.exports = memcached;
