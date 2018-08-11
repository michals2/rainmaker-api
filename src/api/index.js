const { buildSchema } = require("graphql");
const axios = require("axios");

const typeDefs = `
  type Query {
    company(symbol: String!): Company
    companies(limit: Int): [Company]
  }
  type Company {
    name: String
    symbol: String
    logoUrl: String,
    historicalStockPrices: [Int]
  }
`;

const resolvers = {
  Query: {
    company: async (_, { symbol }) => {
      console.log({ symbol });
      return await axios
        .get(`https://api.iextrading.com/1.0/stock/${symbol}/chart/1d`)
        .then(({ data }) => {
          const values = data.map(d => d.average);
          return { historicalStockPrices: values };
        });
    },
    companies: async (_, { limit }) => {
      return await axios
        .get("https://api.iextrading.com/1.0/ref-data/symbols")
        .then(({ data }) => {
          return data.slice(0, limit).map(d => ({
            name: d.name,
            symbol: d.symbol,
            logo: d.logo
          }));
        });
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
