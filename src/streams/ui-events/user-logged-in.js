const { KafkaConsumer } = require('node-rdkafka');

const { EVENTS } = require('../../config');

const globalConfig = {
  'group.id': EVENTS.USER_LOGGED_IN,
  'metadata.broker.list': 'localhost:9092',
};

const topicConfig = {};

const stream = KafkaConsumer.createReadStream(globalConfig, topicConfig, {
  topics: [EVENTS.USER_LOGGED_IN]
});

stream.on('data', function(message) {
  console.log('Got message');
  console.log(message.value.toString());
});
