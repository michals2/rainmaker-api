const { buildSchema } = require("graphql");
const axios = require("axios");

const schema = buildSchema(`
  type Query {
    hello: String
    hi: String
    company: Company
    allCompaniesMetaData: [CompanyMetaData]
  }
  type Company {
    stockPrices: [Float]
    name: String
    symbol: String
  }
  type CompanyMetaData {
    symbol: String
    name: String
  }
`);

const resolvers = {
  hello: () => "Hello world",
  hi: () => "Hi world",
  company: async () => {
    return await axios
      .get("https://api.iextrading.com/1.0/stock/aapl/chart/1d")
      .then(({ data }) => {
        const values = data.map(d => d.average);
        return { stockPrices: values };
      });
  },
  allCompaniesMetaData: async () => {
    return await axios
      .get("https://api.iextrading.com/1.0/ref-data/symbols")
      .then(({ data }) => {
        return data.map(d => ({ symbol: d.symbol, name: d.name }));
      });
  }
};

module.exports = {
  schema,
  rootValue: resolvers
};
