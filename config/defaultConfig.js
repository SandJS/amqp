"use strict";

module.exports = {
  amqp: {
    host: '127.0.0.1',
    port: 5672,
    user: 'guest',
    password: 'guest',
    vhost: '/',
    ssl: {
      enable: false
    }
  },

  autoStart: false,
  consumerDir: '/consumers',
  publisherDir: '/publishers'
};