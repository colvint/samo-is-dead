module.exports = {
  VIEWS: {
    ACCOUNTS: {
      NAME: 'ACCOUNTS_VIEW',
      GRAPHQL_PORT: 3033,
      DB: {
        client: 'sqlite3',
        connection: {
          filename: './views/accounts/db.sqlite3'
        },
        useNullAsDefault: true      
      },
    },
    GATEWAY: {
      NAME: 'GATEWAY_VIEW',
      GRAPHQL_PORT: 3032
    },
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
