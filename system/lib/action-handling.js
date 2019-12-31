const { call, cmds } = require("effects-as-data");
const { camelize } = require('humps');
const { last, mergeDeepRight, path, pathOr, split } = require('ramda');

const { authenticatedConnectionLabelFor } = require('../connections');
const { isValid } = require('./validation');
const { sendEventTo, uuid } = require('../../system/effects');
const EVENT_TYPES = require('../events/types');

const validateAction = config => async ([actionType, action, ack], next) => {
  const validator = config.VALIDATORS[actionType];

  if (validator && !isValid(validator, action))
    return ack({
      success: false,
      result: `${authenticatedConnectionLabelFor(config.socket)} issued invalid ${actionType} ${JSON.stringify(action)}`
    });

  next();
};

const initiateAction = function * (action, config) {
  const initiatedAt = yield cmds.now();
  const sagaId = yield uuid();
  const id = yield uuid();
  
  return mergeDeepRight(action, {
    meta: {
      saga: {
        id: sagaId,
        status: 'initiated',
        actionType: config.actionType,
        initiatedAt,
      },
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
    data: {
      id
    },
  });
};

const changeActionStatus = function * (eventType, action, config) {
  const now = yield cmds.now();
  const status = camelize(last(split('/', eventType.toLowerCase())));
  const updatedAction = mergeDeepRight(action, {
    meta: {
      saga: {
        status,
        [`${status}At`]: now,
        [`${status}In`]: now - path(['meta', 'saga', 'initiatedAt'], action)
      }
    }
  });

  yield sendEventTo(eventType, updatedAction, config);

  return updatedAction;
};

const actionResultPathFor = key => ['meta', 'saga', 'results', key, 'result'];

const isSagaOK = action => pathOr(true, ['meta', 'saga', 'success'], action);

const mergeResponseIntoAction = (resultKey, response, action) =>
  mergeDeepRight(action, {
    meta: {
      saga: {
        success: response.success,
        results: {
          [resultKey]: response
        }
      }
    }
  });

const configSagaRunner = config => function * (originalAction) {
  const rollbackSaga = [];
  const saga = config.SAGAS[config.actionType];

  let action = yield cmds.call(initiateAction, originalAction, config);

  yield sendEventTo(EVENT_TYPES.SAGA_INITIATED, action, config);

  // up
  for (let step of saga) {
    if (step.down) rollbackSaga.unshift(step.down);

    action = mergeResponseIntoAction(
      step.up.resultKey,
      yield cmds.call(step.up.run(config), action),
      action
    );

    if (!isSagaOK(action)) {
      action = yield cmds.call(changeActionStatus, EVENT_TYPES.SAGA_FAILED, action, config);

      break;
    };
  }

  // down
  if (!isSagaOK(action)) {
    action = yield cmds.call(changeActionStatus, EVENT_TYPES.SAGA_ROLLBACK_INITIATED, action, config);

    for (let step of rollbackSaga) {
      action = mergeResponseIntoAction(
        step.resultKey,
        yield cmds.call(step.run(config), action),
        action
      );

      if (!isSagaOK(action)) {
        action = yield cmds.call(changeActionStatus, EVENT_TYPES.SAGA_ROLLBACK_FAILED, action, config);
  
        break;
      }
    }

    return yield cmds.call(changeActionStatus, EVENT_TYPES.SAGA_ROLLBACK_SUCCEEDED, action, config);
  }

  action = yield cmds.call(changeActionStatus, EVENT_TYPES.SAGA_SUCCEEDED, action, config);

  return action;
};

const runSaga = sagaRunner => action => call(sagaRunner, action);

module.exports = {
  actionResultPathFor,
  configSagaRunner,
  runSaga,
  validateAction
};
