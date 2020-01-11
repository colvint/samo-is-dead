const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const { JWT } = require('config');

const authenticatedConnectionLabelFor = ({ decoded_token }) => decoded_token.clientName || decoded_token.email;

const authenticateConnection = secret => socketioJwt.authorize({ secret, handshake: true, auth_header_required: true });

const logClientConnectedEvent = socket => console.log(`🔌  ${chalk.blue(authenticatedConnectionLabelFor(socket))} connected on ${socket.id}`);

const logServiceListeningEvent = (serviceName, servicePort) => console.log(`🚀  ${chalk.blue(serviceName)} listening on port ${servicePort}`)

const socketOptionsforClient = clientName => ({
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${jwt.sign({ clientName }, JWT.SERVER_SECRET)}`
      }
    }
  }
});

module.exports = {
  authenticateConnection,
  authenticatedConnectionLabelFor,
  logClientConnectedEvent,
  logServiceListeningEvent,
  socketOptionsforClient,
};
