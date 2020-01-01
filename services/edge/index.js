const app = require('express')();
const edgeService = require('http').createServer(app);
const edgeSocketServer = require('socket.io')(edgeService);

const { accountsSocketClient } = require('./clients');
const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent } = require('../../system/connections');
const { configSagaRunner, runSaga, validateAction } = require('../../system/lib/action-handling');
const { JWT, SERVICES: { EDGE } } = require('../../config');
const ACTION_TYPES = require('../../system/actions/types');
const ACTIONS = require('../../system/actions');
const EVENT_TYPES = require('../../system/events/types');
const VALIDATORS = require('../../system/validators');

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

edgeService
  .listen(EDGE.SOCKET_PORT, () => logSocketListeningEvent(EDGE) );
