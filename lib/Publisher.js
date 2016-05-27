"use strict";

const amqp = require('@sazze/amqp');

class Publisher extends amqp.publisher {
  /**
   * @param {Object} options
   */
  constructor(options) {
    super(options);
    this.connect();

    // Register with the library.
    sand.amqp.objects.push(this);
  }

  /**
   * Publish a message.
   *
   * !!! WARNING !!! 
   * If this call is yielded when no connection is present, the
   * application will hang because the callback is not invoked
   * until a channel is available.
   * 
   * @param {Buffer|String|Object} message
   * @param {Object} options
   * @param {String} routingKey
   * @return {Promise}
   */
  publish(message, options, routingKey) {
    return new Promise((resolve, reject) => {
      super.publish(message, options, routingKey, function(err, res) {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }
}

module.exports = Publisher;