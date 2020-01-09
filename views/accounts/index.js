const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { addInterpreters, call, onError } = require('effects-as-data');
const chalk = require('chalk');

const { accountsSocketClient } = require('./clients');
const { EFFECTS, EVENTS } = require('@your-organization/system');
const { insertAccounts } = require('./persistors');
const { STEPS: { resolveQuery } } = require('@fxos/system');
const { VIEWS } = require('@your-organization/config');

const accountsDb = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite3'
  },
  useNullAsDefault: true      
});

addInterpreters(EFFECTS.interpreters);
onError(console.error);

accountsSocketClient
  .on(EVENTS.ACCOUNTS_MASS_CREATED, accounts => call(insertAccounts, accountsDb, accounts));

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
