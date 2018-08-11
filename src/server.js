// const { buildSchema } = require("graphql");
// const server = require("express-graphql");
// const CORS = require("micro-cors")();
const { GraphQLServer } = require("graphql-yoga");

const { typeDefs, resolvers } = require("./api");

// const typeDefs = `
//   type Query {
//     hello(name: String): String!
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: (_, { name }) => `Hello ${name || "World"}`
//   }
// };

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
