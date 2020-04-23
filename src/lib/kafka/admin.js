const { AdminClient } = require('node-rdkafka');

module.exports = AdminClient.create({
  'client.id': 'kafka-admin',
  'metadata.broker.list': 'broker01'
});
