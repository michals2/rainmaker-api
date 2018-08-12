const axios = require("axios");

const typeDefs = `
  type Query {
    company(symbol: String!): Company
    companies(limit: Int): [Company]
  }
  type Company {
    name: String
    symbol: String
    historicalStockPrices: [Float]
  }
`;

const context = req => ({
  ...req,
  externalApiRequestHelpers: {
    getCompaniesMetaData: limit =>
      axios.get("https://api.iextrading.com/1.0/ref-data/symbols"),
    getCompanyStockPriceHistory: (symbol, duration = "1d") =>
      axios.get(
        `https://api.iextrading.com/1.0/stock/${symbol}/chart/${duration}`
      ),
    getCompanyMetaData: symbol =>
      axios.get(`https://api.iextrading.com/1.0/stock/${symbol}/company`)
  }
});

const resolvers = {
  Query: {
    company: async (_, { symbol }, ctx) => {
      const {
        getCompanyMetaData,
        getCompanyStockPriceHistory
      } = ctx.externalApiRequestHelpers;

      const companyStockPriceHistory = await getCompanyStockPriceHistory(
        symbol
      ).then(({ data }) => {
        const values = data.map(d => d.average);
        return { historicalStockPrices: values };
      });

      const companyMetaData = await getCompanyMetaData(
        symbol
      ).then(({ data }) => {
        return {
          name: data.companyName,
          symbol
        };
      });

      return { ...companyStockPriceHistory, ...companyMetaData };
    },
    companies: async (_, { limit = 2 }, ctx, info) => {
      const fields = info.fieldNodes[0].selectionSet.selections.map(
        s => s.name.value
      );

      const {
        getCompaniesMetaData,
        getCompanyStockPriceHistory
      } = ctx.externalApiRequestHelpers;
      const companiesMetaData = await getCompaniesMetaData(
        limit
      ).then(({ data }) => {
        return data.slice(0, limit).map(d => ({
          name: d.name,
          symbol: d.symbol
        }));
      });

      if (fields.some(f => f === "historicalStockPrices")) {
        const promiseArr = companiesMetaData.map(m => {
          return getCompanyStockPriceHistory(m.symbol);
        });
        const companiesStockPriceHistory = await Promise.all(
          promiseArr
        ).then(responseArr => {
          return responseArr.map(res =>
            res.data.map(dataPoint => dataPoint.average)
          );
        });
        const mergedData = companiesMetaData.map((companyMetaData, i) => ({
          ...companyMetaData,
          historicalStockPrices: companiesStockPriceHistory[i]
        }));
        return mergedData;
      } else {
        return companiesMetaData;
      }
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
  context
};
