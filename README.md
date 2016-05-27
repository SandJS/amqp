# sand-amqp
This package provides AMQP integration for Sand applications. It wraps [@sazze/amqp](https://github.com/sazze/node-amqp).

## Installation
`npm install --save sand-amqp`

## Usage

### Publisher
The `Publisher` class wraps [@sazze/amqp's Publisher object](https://github.com/sazze/node-amqp/blob/development/master/lib/publisher.js). It automatically handles connectivity upon instantiation, and clean disconnection on application shutdown.

To instantiate a new `Publisher` instance, call `sand.amqp.startPublisher(config, name)`. If `name` is provided, the publisher will be available via the `sand.amqp.publishers` object.

Custom options may be provided upon instantiation; they are defaulted by the `amqp` object in the configuration file.

### Consumer
The `Consumer` class wraps [@sazze/amqp's Consumer object](https://github.com/sazze/node-amqp/blob/development/master/lib/consumer.js). It automatically handles connectivity upon instantiation, and clean disconnection on application shutdown.

To instantiate a new `Consumer` instance, call `sand.amqp.startConsumer(config, name)`. If `name` is provided, the consumer will be available via the `sand.amqp.consumers` object.

Custom options may be provided upon instantiation; they are defaulted by the `amqp` object in the configuration file.

If a `handler` function is provided as an option, it is invoked when a message is received. `handler` may be a regular function or a generator function.

### Autostarting
If `autoStart` is set in the configuration, `sand-amqp` will automatically instantiate any publisher and worker configurations stored in the `publisherDir` and  `consumerDir` directories. This is useful if you want publishers and consumers to automatically start and persist throughout the lifetime of your application.

## License
ISC