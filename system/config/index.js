module.exports = {
  DEFAULT_CONTAINER_HTTP_PORT: 4000,
  DEFAULT_CONTAINER_HTTPS_PORT: 4001,
  VIEWS: {
    ACCOUNTS: {
      NAME: 'ACCOUNTS_VIEW'
    },
    EDGE: {
      NAME: 'EDGE_VIEW'
    },
  },
  SERVICES: {
    EDGE: {
      NAME: 'EDGE_SERVICE'
    },
    ACCOUNTS: {
      NAME: 'ACCOUNTS_SERVICE'
    }
  },
  JWT: {
    CLIENT_SECRET: 'klient-sekret',
    SERVER_SECRET: 'survur-sekret'
  }
};
