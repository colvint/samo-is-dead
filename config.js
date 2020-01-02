module.exports = {
  VIEWS: {
    ACCOUNTS: {
      NAME: 'ACCOUNTS_VIEW',
      GRAPHQL_PORT: 3033
    }
  },
  SERVICES: {
    EDGE: {
      NAME: 'EDGE_SERVICE',
      SOCKET_PORT: 3030
    },
    ACCOUNTS: {
      NAME: 'ACCOUNTS_SERVICE',
      SOCKET_PORT: 3031
    }
  },
  JWT: {
    CLIENT_SECRET: 'klient-sekret',
    SERVER_SECRET: 'survur-sekret'
  }
};
