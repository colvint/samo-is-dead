const app = require('express')();
const http = require('http').createServer(app);
const edgeSocketServer = require('socket.io')(http);
const io = require('socket.io-client');

const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent, socketOptionsforClient } = require('../../system/connections');
const { configSagaRunner, runSaga, validateAction } = require('../../system/lib/action-handling');
const { JWT, SERVICES: { ACCOUNTS, EDGE } } = require('../../config');
const ACTION_TYPES = require('../../system/actions/types');
const ACTIONS = require('../../system/actions');
const EVENT_TYPES = require('../../system/events/types');
const VALIDATORS = require('../../system/validators');

const accountsSocketClient = io(`http://localhost:${ACCOUNTS.SOCKET_PORT}`, socketOptionsforClient(EDGE.NAME));

const setupActionHandlers = io => socket => {
  const config = { io, socket, ACTIONS, accountsSocketClient };

  return socket
    .use(validateAction({ socket, VALIDATORS }))
    // .use(authorizeAction({ socket, AUTHORIZERS }))
    .on(EVENT_TYPES.ACCOUNTS_CREATION_REQUESTED_BY_CLIENT, runSaga(configSagaRunner({ ...config, actionType: ACTION_TYPES.CREATE_ACCOUNTS })));
};

edgeSocketServer
  .use(authenticateConnection(JWT.CLIENT_SECRET))
  .on(EVENT_TYPES.SOCKET_CONNECTED, setupActionHandlers(edgeSocketServer))
  .on(EVENT_TYPES.SOCKET_CONNECTED, logClientConnectedEvent);

http
  .listen(EDGE.SOCKET_PORT, () => logSocketListeningEvent(EDGE) );
