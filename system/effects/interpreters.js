const uuidv4 = require('uuid/v4');

const broadcastEvent = ({ socket, eventType, payload }) => socket.broadcast.emit(eventType, payload);

const sendEventTo = ({ io, id, eventType, payload }) => io.to(`${id}`).emit(eventType, payload);

const sendActionTo = ({ io, actionType, payload }) => new Promise(resolve => io.emit(actionType, payload, resolve));

const uuid = () => uuidv4();

const dbInsert = ({ db, tableName, records }) => db(tableName).insert(records.map(r => ({ id: uuidv4(), ...r })), '*');

const dbSelectWhere = ({ db, tableName, criteria }) => db(tableName).where(criteria);

module.exports = {
  broadcastEvent,
  dbInsert,
  dbSelectWhere,
  sendActionTo,
  sendEventTo,
  uuid
};
