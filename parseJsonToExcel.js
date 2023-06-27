const fileBuilder = require("./src/fileBuilder");
const { readJson } = require("./src/file");
require("dotenv").config();
const parseToArray = (data) => {
  return data.split(",").map((item) => item.trim());
};

const data = readJson(undefined, undefined, `${process.env.AG_FILE_NAME}`);
const requirements = parseToArray(process.env.AG_REQUIREMENTS);
fileBuilder(
  {
    [process.env.AG_FILTER]: data,
  },
  `${process.env.AG_FILE_NAME}.xlsx`,
  requirements
).then(console.log);
