const uuidv4 = require('uuid/v4');

const broadcast = ({ socket, eventType, payload }) => socket.broadcast.emit(eventType, payload);

const sendEventTo = ({ io, id, eventType, payload }) => io.to(`${id}`).emit(eventType, payload);

const sendActionTo = ({ io, actionType, payload }) => new Promise(resolve => io.emit(actionType, payload, resolve));

const uuid = () => uuidv4();

module.exports = {
  broadcast,
  sendActionTo,
  sendEventTo,
  uuid
};
