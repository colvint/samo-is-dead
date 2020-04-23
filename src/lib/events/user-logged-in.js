const avro = require('avsc');

module.exports = avro.Type.forSchema({
  type: 'record',
  fields: [
    { name: 'userId', type: { type: 'string', logicalType: 'uuid' } },
    { name: 'userAgent', type: 'string' },
    { name: 'ipAddress', type: { logicalType: 'ip', type: 'fixed', size: 4 } },
    { name: 'loggedInAt', type: { type: 'long', logicalType: 'timestamp-millis' } },
  ]
});
  