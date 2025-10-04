const seed = require("./seed");
const db = require("./connection");

const testData = require("./data/test");

seed(testData).then(() => {
  db.end();
});
