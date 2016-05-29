"use strict";

const _ = require('lodash');
const Sand = require('sand');
const SandGrain = require('sand-grain');
const Publisher = require('../').Publisher;
const Consumer = require('../').Consumer;

describe('Autostart', function() {
  before(function*(done) {
    let config = require('./fixtures/config/test.js');
    _.extend(config.all, {
      autoStart: true,
      consumerDir: '/test/fixtures/consumers',
      publisherDir: '/test/fixtures/publishers'
    });
    
    yield helpers.Sand.start(config);

    if (sand && sand.amqp && sand.amqp.objects) {
      // Wait until all objects have connected.
      let ready = 0;

      _.each(sand.amqp.objects, (obj) => {
        obj.on('ready', () => {
          if (++ready == sand.amqp.objects.length) {
            done();
          }
        });
      });
    }
  });

  after(function*() {
    yield helpers.Sand.stop();
  });

  it('should start sand with amqp support (autostart config)', function() {
    sand.should.be.instanceof(Sand);
    sand.amqp.should.be.instanceof(SandGrain);
    sand.amqp.objects.should.not.be.empty;
    sand.amqp.publishers.should.not.be.empty;
    sand.amqp.consumers.should.not.be.empty;
  });

  it('should have started publisher from testPublisher.js', function() {
    should.exist(sand.amqp.publishers.testPublisher);
    sand.amqp.publishers.testPublisher.should.be.instanceof(Publisher);
  });

  it('should have started consumer from testConsumer.js', function() {
    should.exist(sand.amqp.consumers.testConsumer);
    sand.amqp.consumers.testConsumer.should.be.instanceof(Consumer);
  });

  it('should consume message', function(done) {
    sand.amqp.consumers.testConsumer.options.handler = () => done();

    // FIXME: see amqp.test.js
    setTimeout(() => {
      sand.amqp.publishers.testPublisher.publish('hello world');
    }, 20);
  });
});