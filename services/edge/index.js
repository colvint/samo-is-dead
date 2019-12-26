const app = require('express')();
const http = require('http').createServer(app);
const edgeSocketServer = require('socket.io')(http);
const io = require('socket.io-client');

const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent, socketOptionsforClient } = require('../../system/connections');
const { createSagaRunner, runSaga, validateAction } = require('../../system/lib/action-handling');
const { JWT, SERVICES: { ACCOUNTS, EDGE } } = require('../../config');
const ACTION_TYPES = require('../../system/actions/types');
const EVENT_TYPES = require('../../system/events/types');
const SAGAS = require('../../system/sagas');
const VALIDATORS = require('../../system/validators');

const accountsSocketClient = io(`http://localhost:${ACCOUNTS.SOCKET.PORT}`, socketOptionsforClient(EDGE.SOCKET.NAME));

const setupActionHandlers = io => socket => {
  const config = { io, socket, SAGAS, accountsSocketClient };

  return socket
    .use(validateAction({ socket, VALIDATORS }))
    // .use(authorizeAction({ socket, AUTHORIZERS }))
    .on(EVENT_TYPES.ACCOUNTS_CREATION_REQUESTED_BY_CLIENT, runSaga(createSagaRunner({ ...config, actionType: ACTION_TYPES.CREATE_ACCOUNTS })));
};

edgeSocketServer
  .use(authenticateConnection(JWT.CLIENT_SECRET))
  .on(EVENT_TYPES.SOCKET_CONNECTED, setupActionHandlers(edgeSocketServer))
  .on(EVENT_TYPES.SOCKET_CONNECTED, logClientConnectedEvent);

http
  .listen(EDGE.SOCKET.PORT, () => logSocketListeningEvent(EDGE.SOCKET) );
