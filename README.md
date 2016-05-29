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

### Consumer
To instantiate a new `Consumer` instance, call `sand.amqp.startConsumer(config, name)`. 

Configuration options are available [here](https://github.com/sazze/node-amqp/blob/development/master/lib/consumer.js); they are defaulted by the `amqp` values in your application's `config/amqp.js` file. If a `handler` function is provided as an option, it is invoked when a message is received. `handler` may be a regular function or a generator function.

If `name` is provided, the consumer will be available via the `sand.amqp.consumers` object.  


### Autostarting
If `autoStart` is set in the configuration, `sand-amqp` will automatically instantiate any publisher and consumer configurations stored in the `publisherDir` and  `consumerDir` directories. This is useful if you want publishers and consumers to automatically start and persist throughout the lifetime of your application.

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