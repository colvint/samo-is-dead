const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const { JWT } = require('../config');

const authenticateConnection = secret => socketioJwt.authorize({ secret, handshake: true, auth_header_required: true });

const logClientConnectedEvent = ({ id, decoded_token }) => console.log(`🔌  ${chalk.blue(decoded_token.clientName || decoded_token.email)} connected on ${id}`);

const logSocketListeningEvent = socket => console.log(`🚀  ${chalk.blue(socket.NAME)} listening at http://localhost:${socket.PORT}`)

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
  logClientConnectedEvent,
  logSocketListeningEvent,
  socketOptionsforClient,
};
