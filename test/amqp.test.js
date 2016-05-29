"use strict";

const Sand = require('sand');
const SandGrain = require('sand-grain');
const Publisher = require('../').Publisher;
const Consumer = require('../').Consumer;

describe('sand.amqp', function() {
  before(function*() {
    yield helpers.Sand.start();
  });

  after(function*() {
    yield helpers.Sand.stop();
  });

  it('should start sand with amqp support (default config)', function() {
    sand.should.be.instanceof(Sand);
    sand.amqp.should.be.instanceof(SandGrain);
    sand.amqp.objects.should.be.empty;
    sand.amqp.publishers.should.be.empty;
    sand.amqp.consumers.should.be.empty;
  });

  it('should start publisher', function(done) {
    sand.amqp.startPublisher({}, 'test');
    should.exist(sand.amqp.publishers.test);
    sand.amqp.publishers.test.should.be.instanceof(Publisher);

    // Ensure the publisher connects to the AMQP server.
    sand.amqp.publishers.test.on('ready', function() {
      done();
    });
  });

  it('should start consumer', function(done) {
    sand.amqp.startConsumer({}, 'test');
    should.exist(sand.amqp.consumers.test);
    sand.amqp.consumers.test.should.be.instanceof(Consumer);

    // Ensure the consumer connects to the AMQP server.
    sand.amqp.consumers.test.on('ready', function() {
      done();
    });
  });

  it('should consume message', function(done) {
    sand.amqp.consumers.test.options.handler = () => done();

    // FIXME: despite the publisher & consumer emitting `ready`, this event wasn't being consumed immediately.
    setTimeout(() => {
      sand.amqp.publishers.test.publish('hello world');
    }, 20);
  });
});