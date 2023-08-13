const Redis = require('ioredis');

/** @type {import('ioredis').Redis} */
const redis = new Redis();

module.exports = redis;