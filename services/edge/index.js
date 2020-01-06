const { addInterpreters, call, onError } = require('effects-as-data');
const app = require('express')();
const edgeService = require('http').createServer(app);
const edgeSocketServer = require('socket.io')(edgeService);

const { CONNECTIONS: { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent }, ACTIONS: { runSaga, validateAction } } = require('@aqueoss/system');
const { EVENTS } = require('@your-organization/system');
const { JWT, SERVICES: { EDGE } } = require('@your-organization/config');
const { EFFECTS, VALIDATORS } = require('@your-organization/system');
const SAGAS = require('./sagas');

addInterpreters(EFFECTS.interpreters);
onError(console.error);

const callSaga = (config, saga) => action => call(runSaga, config, saga, action); 

const setupActionHandlers = io => socket => {
  const config = { io, socket };

  return socket
    .use(validateAction({ socket, VALIDATORS }))
    // .use(authorizeAction({ socket, AUTHORIZERS }))
    .on(EVENTS.FROM_CLIENT_ACCOUNTS_CREATION_REQUESTED, callSaga(config, SAGAS.CREATE_ACCOUNTS));
};

edgeSocketServer
  .use(authenticateConnection(JWT.CLIENT_SECRET))
  .on(EVENTS.SOCKET_CONNECTED, setupActionHandlers(edgeSocketServer))
  .on(EVENTS.SOCKET_CONNECTED, logClientConnectedEvent);

edgeService
  .listen(EDGE.SOCKET_PORT, () => logSocketListeningEvent(EDGE) );
