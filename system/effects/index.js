const { addInterpreters, effect, onError } = require("effects-as-data");
const axios = require('axios');

const interpreters = require('./interpreters');

addInterpreters(interpreters);
onError(console.error);

const broadcastEvent = (socket, eventType, payload) => ({
  type: 'broadcastEvent',
  eventType,
  payload,
  socket,
});

const sendEventTo = (eventType, payload, config) => ({
  type: 'sendEventTo',
  eventType,
  id: config.socket.id,
  io: config.io,
  payload,
});

const sendActionTo = (io, actionType, payload) => ({
  type: 'sendActionTo',
  actionType,
  io,
  payload,
});

const uuid = () => ({
  type: 'uuid',
});

const get = effect(axios.get);

const dbInsert = (db, tableName, records) => ({
  type: 'dbInsert',
  db,
  tableName,
  records,
});

const dbSelectWhere = (db, tableName, criteria = {}) => ({
  type: 'dbSelectWhere',
  db,
  tableName,
  criteria,
});

module.exports = {
  broadcastEvent,
  dbInsert,
  dbSelectWhere,
  sendActionTo,
  sendEventTo,
  get,
  uuid,
};
