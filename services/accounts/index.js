const app = require('express')();
const http = require('http').createServer(app);
const accountsSocketServer = require('socket.io')(http);

const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent } = require('../../system/connections');
const { JWT, SERVICES: { ACCOUNTS } } = require('../../config');
const { validateAction } = require('../../system/lib/action-handling');
const ACTION_TYPES = require('../../system/actions/types');
const EVENT_TYPES = require('../../system/events/types');
// const SAGAS = require('../../system/sagas');
const VALIDATORS = require('../../system/validators');

const ackEcho = (action, ack) => ack(action);

const setupActionHandlers = io => socket =>
  socket
    .use(validateAction({ socket, VALIDATORS }))
    .on(ACTION_TYPES.CREATE_ACCOUNTS, ackEcho);

accountsSocketServer
  .use(authenticateConnection(JWT.SERVER_SECRET))
  .on(EVENT_TYPES.SOCKET_CONNECTED, setupActionHandlers(accountsSocketServer))
  .on(EVENT_TYPES.SOCKET_CONNECTED, logClientConnectedEvent);

http
  .listen(ACCOUNTS.SOCKET.PORT, () => logSocketListeningEvent(ACCOUNTS.SOCKET));
