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

const rejectWith = message => ({
  type: 'rejectWith',
  message,
});

const get = effect(axios.get);

module.exports = {
  broadcastEvent,
  sendActionTo,
  sendEventTo,
  get,
  rejectWith,
  uuid,
};
