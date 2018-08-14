module.exports = {
  resolvers: require("./iex.resolvers"),
  typeDefs: require("../../utils/gqlLoader")("iex/iex.graphql")
};
