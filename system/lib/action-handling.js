const { call, cmds } = require("effects-as-data");
const { camelize } = require('humps');
const { last, mergeDeepRight, path, pathOr, split } = require('ramda');

const { authenticatedConnectionLabelFor } = require('../connections');
const { isValid } = require('./validation');
const { broadcastEvent, uuid } = require('../../system/effects');
const EVENT_TYPES = require('../events/types');

const validateAction = config => async ([actionType, action, ack], next) => {
  const validator = config.VALIDATORS[actionType];

  if (validator && !isValid(validator, action))
    return ack({
      success: false,
      result: `${authenticatedConnectionLabelFor(config.socket)} issued invalid action ${actionType} ${JSON.stringify(action)}`
    });

  next();
};

const initiateAction = function * (action, config) {
  const initiatedAt = yield cmds.now();
  const actionId = yield uuid();
  
  return mergeDeepRight(action, {
    meta: {
      device: {
        ip: path(['socket', 'handshake', 'address'], config),
        userAgent: path(['socket', 'handshake', 'headers', 'user-agent'], config)
      },
      account: {
        id: path(['socket', 'decoded_token', 'account_id'], config),
        name: path(['socket', 'decoded_token', 'name'], config),
        email: path(['socket', 'decoded_token', 'email'], config)
      }
    },
    action: {
      id: actionId,
      type: config.actionType,
      status: 'initiated',
      initiatedAt,
    },
  });
};

const updateActionStatus = function * (eventType, action, config) {
  const now = yield cmds.now();
  const status = camelize(last(split('/', eventType.toLowerCase())));
  const updatedAction = mergeDeepRight(action, {
    action: {
      status,
      [`${status}At`]: now,
      [`${status}In`]: now - path(['action', 'initiatedAt'], action)
    }
  });

  yield broadcastEvent(config.socket, eventType, updatedAction);

  return updatedAction;
};

const actionResultPathFor = key => ['action', 'steps', key, 'result'];

const isSagaOK = action => pathOr(true, ['action', 'success'], action);

const mergeResponseIntoAction = (stepName, stepResponse, action) =>
  mergeDeepRight(action, {
    action: {
      success: stepResponse.success,
      steps: {
        [stepName]: stepResponse
      }
    }
  });

const configSagaRunner = config => function * (originalAction) {
  const rollbackSaga = [];
  const saga = config.ACTIONS[config.actionType];

  let action = yield cmds.call(initiateAction, originalAction, config);

  yield broadcastEvent(config.socket, EVENT_TYPES.ACTION_INITIATED, action);

  // up
  for (let step of saga) {
    if (step.down) rollbackSaga.unshift(step.down);

    action = mergeResponseIntoAction(step.up.name, yield cmds.call(step.up.run(config), action), action);

    if (!isSagaOK(action)) {
      action = yield cmds.call(updateActionStatus, EVENT_TYPES.ACTION_FAILED, action, config);

      break;
    };
  }

  // down
  if (!isSagaOK(action)) {
    action = yield cmds.call(updateActionStatus, EVENT_TYPES.ACTION_ROLLBACK_INITIATED, action, config);

    for (let step of rollbackSaga) {
      action = mergeResponseIntoAction(step.name, yield cmds.call(step.run(config), action), action);

      if (!isSagaOK(action)) {
        action = yield cmds.call(updateActionStatus, EVENT_TYPES.ACTION_ROLLBACK_FAILED, action, config);
  
        break;
      }
    }

    return yield cmds.call(updateActionStatus, EVENT_TYPES.ACTION_ROLLBACK_SUCCEEDED, action, config);
  }

  action = yield cmds.call(updateActionStatus, EVENT_TYPES.ACTION_SUCCEEDED, action, config);

  return action;
};

const runSaga = sagaRunner => action => call(sagaRunner, action);

module.exports = {
  actionResultPathFor,
  configSagaRunner,
  runSaga,
  validateAction
};
