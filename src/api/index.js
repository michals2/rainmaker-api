const { buildSchema } = require("graphql");
const axios = require("axios");

const schema = buildSchema(`
  type Query {
    hello: String
    hi: String
    stockPrices: [Float]
  }
`);

const resolvers = {
  hello: () => "Hello world",
  hi: () => "Hi world",
  stockPrices: async () => {
    return await axios
      .get("https://api.iextrading.com/1.0/stock/aapl/chart/1d")
      .then(({ data }) => {
        const values = data.map(d => d.average);
        return values;
      });
  }
};

module.exports = {
  schema,
  rootValue: resolvers
};
