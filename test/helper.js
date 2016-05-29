"use strict";

// Load Mocha
global.mocha = require('mocha');
global.comocha = require('co-mocha');

comocha(mocha);

// Load Chai
global.should = require('chai')
  .use(require('chai-as-promised'))
  .should();

// Make helpers available
global.helpers = {
  Sand: require('./helpers/Sand')
};

// Suppress SSL errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;