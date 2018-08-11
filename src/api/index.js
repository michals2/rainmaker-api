const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const resolvers = {
  hello: () => "Hello world"
};

module.exports = {
  schema,
  rootValue: resolvers
};
