const ENV = process.env.NODE_ENV;

const testData = require("./test");
const devData = require("./dev");

const data = {
  test: testData,
  development: devData,
  production: devData,
};

module.exports = data[ENV];
