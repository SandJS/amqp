# sand-amqp
This package provides AMQP integration for Sand applications. It wraps [@sazze/amqp](https://github.com/sazze/node-amqp).

## Installation
`npm install --save sand-amqp`

## Usage
The `Publisher` and `Consumer` classes wrap their respective objects from [@sazze/amqp](https://github.com/sazze/node-amqp/tree/development/master/lib). They automatically handle connectivity upon instantiation, and clean disconnection on application shutdown. The `ready` event is raised when connectivity is established.

### Publisher
To instantiate a new `Publisher` instance, call `sand.amqp.startPublisher(config, name)`.

Configuration options are available [here](https://github.com/sazze/node-amqp/blob/development/master/lib/publisher.js); they are defaulted by the `amqp` values in your application's `config/amqp.js` file.
 
If `name` is provided, the publisher will be available via the `sand.amqp.publishers` object.

In addition to the publisher options there is also `autoConnect`, which defaults to **true** and determines whether or not to auto connect on instantiation.

### Consumer
To instantiate a new `Consumer` instance, call `sand.amqp.startConsumer(config, name)`. 

Configuration options are available [here](https://github.com/sazze/node-amqp/blob/development/master/lib/consumer.js); they are defaulted by the `amqp` values in your application's `config/amqp.js` file. If a `handler` function is provided as an option, it is invoked when a message is received. `handler` may be a regular function or a generator function.

If `name` is provided, the consumer will be available via the `sand.amqp.consumers` object.  

In addition to the consumer options, specific to this library there is also `autoStart`, which defaults to **true** and determines whether or not the consumer starts on instantiation. There is also `runInSandContext` which defaults to **true**. If _TRUE_ then the `handler` function runs inside a sand context.


### Autostarting
If `autoStart` is set in the configuration, `sand-amqp` will automatically instantiate any publisher and consumer configurations stored in the `publisherDir` and  `consumerDir` directories. This is useful if you want publishers and consumers to automatically start and persist throughout the lifetime of your application.

`publisherDir` and `consumerDir` values should be relative to your Sand application path.

## Example
This example Sand application will connect to the local AMQP instance and publish the string `hello world` to the `demo` exchange once per second.

**config/amqp.js**:
```js
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
```

**app.js**:
```js
"use strict";

const Sand = require('sand');
const amqp = require('sand-amqp');

new Sand({ appPath: __dirname })
  .use(amqp)
  .start(function*() {
    sand.amqp.startConsumer({
      exchange: {
        name: 'demo',
        type: 'direct'
      },
      handler: (msg) => console.log(msg)
    });

    let publisher = sand.amqp.startPublisher({
      exchange: {
        name: 'demo',
        type: 'direct'
      }
    });

    setInterval(function() {
      publisher.publish('hello world');
    }, 1000);
  });
```

Output:
```
hello world
hello world
hello world
```

## Testing
**Note: A running AMQP instance is required for tests to pass. You may need to adjust `test/fixtures/config/test.js` for your environment.**

To test, run `npm test` from the project root directory.


## License
ISC