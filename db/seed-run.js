const seed = require("./seed");
const db = require("./connection");

const testData = require("./data");

seed(testData).then(() => {
  db.end();
});
