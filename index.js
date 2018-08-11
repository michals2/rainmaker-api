const { buildSchema } = require("graphql");
const server = require("express-graphql");
const CORS = require("micro-cors")();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => "Hello world"
};

module.exports = CORS(server({ schema, rootValue }));
