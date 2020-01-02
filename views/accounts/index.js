const { ApolloServer, gql } = require('apollo-server');
const { call } = require('effects-as-data');
const chalk = require('chalk');

const { accountsSocketClient } = require('./clients');
const { insertAccounts } = require('./persistors');
const dbConfig = require('./knexfile');
const accountsDb = require('knex')(dbConfig);
const EVENT_TYPES = require('../../system/events/types');
const { VIEWS } = require('../../config');
const { dbSelectWhere } = require('../../system/effects')

accountsSocketClient
  .on(EVENT_TYPES.STATE_CHANGE_ACCOUNTS_CREATED, accounts => call(insertAccounts, accountsDb, accounts));

const typeDefs = gql`
  type Query {
    accounts: [Account]
  }

  type Account {
    id: ID!
    firstName: String
    lastName: String
    email: String
    gender: String
  }
`;

const resolveQuery = function * (db, tableName, criteria) {
  return yield dbSelectWhere(db, tableName, criteria);
};

const resolvers = {
  Query: {
    accounts: () => call(resolveQuery, accountsDb, 'accounts')
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(VIEWS.ACCOUNTS.GRAPHQL_PORT).then(({ url }) => {
  console.log(`🚀  ${chalk.blue(VIEWS.ACCOUNTS.NAME)} graphQL server ready at ${url}`);
});
