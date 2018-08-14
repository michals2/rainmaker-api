const merge = require("lodash/merge");
const iex = require("./iex");

module.exports = {
  typeDefs: [iex.typeDefs].join(" "),
  resolvers: merge({}, iex.resolvers)
};
