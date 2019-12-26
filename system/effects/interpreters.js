const uuidv4 = require('uuid/v4');

const broadcast = ({ socket, eventType, payload }) => socket.broadcast.emit(eventType, payload);

const sendEventTo = ({ io, id, eventType, payload }) => io.to(`${id}`).emit(eventType, payload);

const sendActionTo = ({ io, actionType, payload }) => new Promise(resolve => {
  io.emit(actionType, payload, result => {
    console.log(result);
    resolve(result);
  })
});

const uuid = () => uuidv4();

const rejectWith = ({ message }) => Promise.reject(message);

module.exports = {
  broadcast,
  sendActionTo,
  sendEventTo,
  rejectWith,
  uuid
};
