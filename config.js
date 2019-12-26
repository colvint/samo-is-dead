module.exports = {
  SERVICES: {
    EDGE: {
      SOCKET: {
        PORT: 3030,
        NAME: 'EDGE_SOCKET'
      }
    },
    ACCOUNTS: {
      SOCKET: {
        PORT: 3031,
        NAME: 'ACCOUNTS_SOCKET'
      }
    }
  },
  JWT: {
    CLIENT_SECRET: 'klient-sekret',
    SERVER_SECRET: 'survur-sekret'
  }
};
