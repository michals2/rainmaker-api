const { GraphQLServer } = require("graphql-yoga");

const { typeDefs, resolvers, context } = require("./api");

const server = new GraphQLServer({ typeDefs, resolvers, context });
server.start(() => console.log("Server is running on localhost:4000"));
