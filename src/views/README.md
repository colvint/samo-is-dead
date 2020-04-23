# View

A view is a [graphQL](https://graphql.org/) [server](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-fastify) which exposes itself to a graphQL [federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/). Its underlying data is a [materialized view](https://www.confluent.io/blog/unifying-stream-processing-and-interactive-queries-in-apache-kafka/) built up by a [Kafka sink](https://docs.confluent.io/current/connect/index.html).

It is good practice to optimize your views for use in your UI. For example, if you have a UI which displays a list of users with the number of logins, it makes sense to store a table with exactly that information (including the count) in it.
