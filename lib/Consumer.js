"use strict";

const amqp = require('@sazze/amqp');
const co = require('co');

class Consumer extends amqp.consumer {
  constructor(options) {
    super(options);
    this.setMessageHandler(this.onMessage);
    this.connect();

    // Register with the library.
    sand.amqp.objects.push(this);
  }

  /**
   * Default consumer message handler.
   * 
   * If a handler exists in this consumer's configuration, invoke it.
   * 
   * @param content
   * @param channel
   * @param message
   */
  onMessage(content, channel, message) {
    if (!this.options.handler) {
      return;
    }

    co(this.options.handler.bind(this, content, channel, message))
      .catch((e) => {
        console.log('Consumer handler error', e)
      });
  }
}

module.exports = Consumer;