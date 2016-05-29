"use strict";

const Sand = require('sand');
const AMQP = require('../../index.js');
const Path = require('path');

module.exports = class {
  /**
   * Initialize a new Sand application with AMQP support.
   *
   * @param {Object} [config] -- AMQP config
   */
  static *start(config) {
    config = config || require('../fixtures/config/test.js');

    return new Promise((resolve, reject) => {
      let appPath = Path.resolve(__dirname, '../..');
  
      new Sand({ appPath: appPath })
        .use(AMQP, config)
        .start(resolve);
    });
  }
  
  static *stop() {
    return new Promise((resolve, reject) => {
      sand.shutdown(resolve);
    });
  }
};