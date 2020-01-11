const app = require('express')();
const accountsService = require('http').createServer(app);
const accountsSocketServer = require('socket.io')(accountsService);

const { CONNECTIONS: { authenticateConnection, logClientConnectedEvent, logServiceListeningEvent }, STEPS: { ackStep } } = require('@fxos/system');
const { JWT, DEFAULT_CONTAINER_HTTP_PORT, SERVICES: { ACCOUNTS } } = require('@your-organization/config');
// const { validateAction } = require('../../system/lib/action-handling');
const { EVENTS, STEPS: { createAccounts, STEP_TYPES } } = require('@your-organization/system');

const setupHandlers = socket =>
  socket
    // .use(validateAction({ socket, VALIDATORS }))
    .on(STEP_TYPES.CREATE_ACCOUNTS, ackStep(createAccounts({ socket })));

accountsSocketServer
  .use(authenticateConnection(JWT.SERVER_SECRET))
  .on(EVENTS.SOCKET_CONNECTED, setupHandlers)
  .on(EVENTS.SOCKET_CONNECTED, logClientConnectedEvent);

accountsService
  .listen(DEFAULT_CONTAINER_HTTP_PORT, () => logServiceListeningEvent(ACCOUNTS.NAME, DEFAULT_CONTAINER_HTTP_PORT));
