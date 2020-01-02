const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const chalk = require('chalk');

const { VIEWS } = require('../config');

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: `http://localhost:${VIEWS.ACCOUNTS.GRAPHQL_PORT}/graphql` },
    // { name: "listings", url: "http://localhost:4002/graphql" },
    // { name: "reviews", url: "http://localhost:4003/graphql" },
  ]
})

const server = new ApolloServer({
  gateway,
  subscriptions: false, // Disable subscriptions (not currently supported with ApolloGateway)
})

server.listen(VIEWS.GATEWAY.GRAPHQL_PORT).then(({ url }) => {
  console.log(`🚀  ${chalk.blue(VIEWS.GATEWAY.NAME)} graphQL federation ready at ${url}`)
})
