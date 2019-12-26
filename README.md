# AQuEOSS
Action Query Effect-Oriented Socket Server

## What?

A server-side architecture inspired by microservice architecture, CQRS, Redux Saga and PubSub.

- Scales processing units independently
- Separates read and write operations
- Publishes realtime events
- Purifies code by describe effects as data
- Deploys to any kubernetes cluster with a single command

## Vocbulary

To better understand this architecture, let's first define a few terms:

- **Query Federation**: A GraphQL edge exposing a unified, query-only interface to all view projections.
- **Query**: A normal GraphQL query.
- **Edge Socket**: A normal dual-channel SocketIO socket exposed to clients.
- **Action**: A messages sent to the write channel of the edge socket. Also called a "command" in the CQRS architecture.
- **Event**: A messages sent from the read channel of the edge socket.
- **Saga**: A series of steps taken in response to an action.
- **Step**: A single computation as part of a saga.
- **Effect**: An instruction (impure) which uses or modifies external state.

SERVICE
  ACCEPTS COMMANDS (COMMAND/[COMMAND_NAME])
  -----------------------------------------------------------
    CREATE_BID

  EMITS EVENTS (EVENT/[EVENT_NAME])
  -----------------------------------------------------------
    EVENT/
      FAILED_AUTHENTICATION
      FAILED_VALIDATION
      ENQUEUED
      SAGA_INITIATED
      SAGA_FAILED
      SAGA_ROLLBACK_INITIATED
      SAGA_ROLLBACK_FAILED
      SAGA_ROLLBACK_SUCCEEDED
      SAGA_SUCCEEDED
      PROJECTION_UPDATED
      CHECKPOINT_SET

  READ SOCKET
  -----------------------------------------------------------
    subscribe to commands (effect)
    authenticate command
      - failure
        - emit COMMAND/CREATE_BID/FAILED_AUTHENTICATION event (effect)
      - success
        - validate command
          - failure
            - emit COMMAND/CREATE_BID/FAILED_VALIDATION event (effect)
          - success
            - pass command to saga orchestrator
            - enqueue command (command service only)
            - emit COMMAND/CREATE_BID/ENQUEUED event (effect)

  WRITE SOCKET
  -----------------------------------------------------------
    emit SERVICE/COMMAND
    emit COMMAND/CREATE_BID/PROJECTION_UPDATED (effect)

  SAGA
  -----------------------------------------------------------
    emit COMMAND/CREATE_BID/INITIATED
      - failure
        - emit COMMAND/CREATE_BID/ROLLBACK_INITIATED (effect)
        - run rollback saga
        - failure
          - emit COMMAND/CREATE_BID/ROLLBACK_FAILED (effect)
          - reset to system checkpoint (effect)
          - emit SYSTEM/STATE/CHECKPOINT_SET (effect)
        - success
          - emit COMMAND/CREATE_BID/ROLLBACK_SUCCEEDED (effect)
        - set system checkpoint (effect)
        - emit SYSTEM/STATE/CHECKPOINT_SET (effect)
      - success
        - set system checkpoint (effect)
        - emit SYSTEM/STATE/CHECKPOINT_SET (effect)
    for each step in saga
      - run next step
        - failure
          - return failure
        - success
          - return success
    emit COMMAND/CREATE_BID/SUCCEEDED event (effect)

  VIEW PROJECTOR
  -----------------------------------------------------------
    persist state
    emit PROJECTION_UPDATED event (effect)

