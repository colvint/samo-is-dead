const { call, cmds } = require("effects-as-data");
const app = require('express')();
const accountsService = require('http').createServer(app);
const accountsSocketServer = require('socket.io')(accountsService);

const { authenticateConnection, logClientConnectedEvent, logSocketListeningEvent } = require('../../system/connections');
const { JWT, SERVICES: { ACCOUNTS } } = require('../../config');
// const { validateAction } = require('../../system/lib/action-handling');
const STEP_TYPES = require('../../system/actions/steps/types');
const EVENT_TYPES = require('../../system/events/types');
const { getRandomUsers } = require('../../system/actions/steps');
const { broadcastEvent } = require('../../system/effects');

const callStep = step => (action, ack) => call(step, action, ack);

const createAccounts = config => function * (action, ack) {
  const response = yield cmds.call(getRandomUsers, action.data.count);
  const users = response.result;

  yield broadcastEvent(config.socket, EVENT_TYPES.STATE_CHANGE_ACCOUNTS_CREATED, users);

  ack(response);

  return users;
};

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
