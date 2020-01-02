const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { call } = require('effects-as-data');
const chalk = require('chalk');

const { accountsSocketClient } = require('./clients');
const { insertAccounts } = require('./persistors');
const { resolveQuery } = require('../lib');
const { VIEWS } = require('../../config');
const accountsDb = require('knex')(require('./knexfile'));
const EVENT_TYPES = require('../../system/events/types');

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

const resolvers = {
  Query: {
    accounts: () => call(resolveQuery, accountsDb, 'accounts')
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen(VIEWS.ACCOUNTS.GRAPHQL_PORT).then(({ url }) => {
  console.log(`🚀  ${chalk.blue(VIEWS.ACCOUNTS.NAME)} graphQL server ready at ${url}`);
});
