"use strict";

let logger = global.sand;

// To Support Logging until @sazze/amqp is changed, this needs to be at the top
// Support Aura logging. This must be declared before Aura modules are required. (e.g. @sazze/node-amqp)
if (!global.aura) {
  global.aura = {
    log: {
      _log: (level, args) =>  logger ? logger[level].apply(logger, args) : console.log.apply(console, args),
      error: function() { this._log('error', arguments) },
      warn: function() { this._log('warn', arguments) },
      info: function() { this._log('log', arguments) },
      debug: function() { this._log('log', arguments) },
      verbose: function() { this._log('log', arguments) }
    }
  };
}

const SandGrain = require('sand-grain');
const _ = require('lodash');
const path = require('path');
const requireAll = require('require-all');
const Consumer = require('./lib/Consumer');
const Publisher = require('./lib/Publisher');

class AMQP extends SandGrain {
  constructor() {
    super();
    this.name = this.configName = 'amqp';
    this.defaultConfig = require('./config/defaultConfig');
    this.version = require('./package.json').version;
    this.consumers = {};
    this.publishers = {};
    this.objects = [];  // all consumers and subscribers

    // Set the logger to AMQP
    logger = this || global.sand;
  }

  init(config, done) {
    super.init(config);

    if (this.config.autoStart) {
      this.autoStart();
    }

    done();
  }

  /**
   * Gracefully stop all publishers/consumers.
   *
   * @param {Function} done
   */
  shutdown(done) {
    let pending = this.objects.length;

    function onStop() {
      if (!--pending) {
        done();
      }
    }

    for (let object of this.objects) {
      if (object instanceof Publisher) {
        object.close(onStop);
      } else if (object instanceof Consumer) {
        object.stop(onStop);
      }
    }
  }

  /**
   * Start a consumer.
   *
   * @param {Object} [config] -- consumer config
   * @param {String} [name] -- key for `sand.amqp.consumers` object
   * @return {Consumer}
   */
  startConsumer(config, name) {
    config = _.defaults({}, config, this.config.amqp);
    name = name || '';
    let consumer = new Consumer(config);

    if (name) {
      this.consumers[name] = consumer;
    }

    return consumer;
  }

  /**
   * Start a publisher.
   *
   * @param {Object} [config] -- publisher config
   * @param {String} [name] -- name to make available via `sand.amqp.publishers` object
   * @return {Publisher}
   */
  startPublisher(config, name) {
    config = _.defaults({}, config, this.config.amqp);
    name = name || '';
    let publisher = new Publisher(config);

    if (name) {
      this.publishers[name] = publisher;
    }

    return publisher;
  }

  /**
   * Automatically start all objects in the consumer/publisher directories.
   */
  autoStart() {
    // Load consumers
    if (this.config.consumerDir) {
      let consumerDir = path.join(sand.appPath, this.config.consumerDir);

      try {
        requireAll({
          dirname: consumerDir,
          map: (file, filepath) => {
            let config = require(filepath);
            this.startConsumer(config, file);
          }
        });
      } catch (e) {
        sand.error('Autostarting of consumers failed', e.stack || e.message || e);
      }
    }

    // Load publishers
    if (this.config.publisherDir) {
      let publisherDir = path.join(sand.appPath, this.config.publisherDir);

      try {
        requireAll({
          dirname: publisherDir,
          map: (file, filepath) => {
            let config = require(filepath);
            this.startPublisher(config, file);
          }
        });
      } catch (e) {
        sand.error('Autostarting of publishers failed', e.stack || e.message || e);
      }
    }
  }

}

module.exports = AMQP;
module.exports.Consumer = Consumer;
module.exports.Publisher = Publisher;