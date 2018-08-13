const axios = require("axios");

const typeDefs = `
  type Query {
    stock(symbol: String!): Stock
  }
  type Stock {
    chart(range: String!): [StockDataPoint]
  }
  type StockDataPoint {
    date: String
    minute: String
    high: Float
    low: Float
    average: Float
  }
  enum Range {
    d1
    m1
    m3
    m6
    ytd
    y1
    y2
    y5
  }
`;

const urlBase = "https://api.iextrading.com/1.0";
const enumRangeMap = {
  d1: "1d",
  m1: "1m",
  m3: "2m",
  m6: "6m",
  ytd: "ytd",
  y1: "1y",
  y2: "2y",
  y5: "5y"
};

const resolvers = {
  Query: {
    stock: (_, { symbol }) => {
      return { symbol };
    }
  },
  Stock: {
    chart: ({ symbol }, { range }) => {
      return axios
        .get(`${urlBase}/stock/${symbol}/chart/${enumRangeMap[range]}`)
        .then(({ data }) => data);
    }
  },
  StockDataPoint: {
    date: obj => obj.date,
    minute: obj => obj.minute,
    high: obj => obj.high,
    low: obj => obj.low,
    average: obj => obj.average
  }
};

module.exports = {
  typeDefs,
  resolvers
};
