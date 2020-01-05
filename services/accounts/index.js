const app = require('express')();
const accountsService = require('http').createServer(app);
const accountsSocketServer = require('socket.io')(accountsService);

const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent } = require('../../packages/connections');
const { JWT, SERVICES: { ACCOUNTS } } = require('../../config');
// const { validateAction } = require('../../system/lib/action-handling');
const STEP_TYPES = require('../../system/actions/steps/types');
const EVENT_TYPES = require('../../packages/events/types');

const setupHandlers = socket =>
  socket
    // .use(validateAction({ socket, VALIDATORS }))
    .on(STEP_TYPES.CREATE_ACCOUNTS, callStep(createAccounts({ socket })));

accountsSocketServer
  .use(authenticateConnection(JWT.SERVER_SECRET))
  .on(EVENT_TYPES.SOCKET_CONNECTED, setupHandlers)
  .on(EVENT_TYPES.SOCKET_CONNECTED, logClientConnectedEvent);

accountsService
  .listen(ACCOUNTS.SOCKET_PORT, () => logSocketListeningEvent(ACCOUNTS));
