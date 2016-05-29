"use strict";

module.exports = {
  all: {
    amqp: {
      host: '127.0.0.1',
      port: 5672,
      user: 'guest',
      password: 'guest',
      vhost: '/',
      ssl: {
        enable: false
      }
    }
  }
};