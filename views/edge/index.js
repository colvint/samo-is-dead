const { addInterpreters, onError } = require('effects-as-data');
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const chalk = require('chalk');

const { VIEWS } = require('@your-organization/config');
const { EFFECTS } = require('@your-organization/system');

addInterpreters(EFFECTS.interpreters);
onError(console.error);

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: `http://localhost:${VIEWS.ACCOUNTS.GRAPHQL_PORT}/graphql` },
    // { name: "listings", url: "http://localhost:4002/graphql" },
    // { name: "reviews", url: "http://localhost:4003/graphql" },
  ]
});

const server = new ApolloServer({
  gateway,
  subscriptions: false, // Disable subscriptions (not currently supported with ApolloGateway)
});

server.listen(VIEWS.EDGE.GRAPHQL_PORT).then(({ url }) => {
  console.log(`🚀  ${chalk.blue(VIEWS.EDGE.NAME)} graphQL federation ready at ${url}`)
});
