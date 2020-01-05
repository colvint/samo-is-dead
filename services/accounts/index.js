const app = require('express')();
const accountsService = require('http').createServer(app);
const accountsSocketServer = require('socket.io')(accountsService);

const { CONNECTIONS: { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent }, STEPS: { ackStep } } = require('@aqueoss/system');
const { JWT, SERVICES: { ACCOUNTS } } = require('@your-organization/config');
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
  .listen(ACCOUNTS.SOCKET_PORT, () => logSocketListeningEvent(ACCOUNTS));
