// const { buildSchema } = require("graphql");
const server = require("express-graphql");
const CORS = require("micro-cors")();

const { schema, rootValue } = require("./api");

module.exports = CORS(server({ schema, rootValue }));
