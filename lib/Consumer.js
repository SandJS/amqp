"use strict";

const amqp = require('@sazze/amqp');
const co = require('co');

let defaultConfig = {
  autoStart: true,
  runInSandContext: true
};

class Consumer extends amqp.consumer {
  constructor(options) {
    super(_.defaults({}, options, defaultConfig));
    this.setMessageHandler(this.onMessage);

    if (this.options.autoStart) {
      this.start();
    }

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

    let fn = sand && sand.runInContext && this.options.runInSandContext ? sand.runInContext : co;

    fn(this.options.handler.bind(this, content, channel, message))
      .catch((e) => {
        console.log('Consumer handler error', e)
      });
  }
}

module.exports = Consumer;