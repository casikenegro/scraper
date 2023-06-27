// importing the fs module
const fs = require("fs");

// initializing a JavaScript object
const saveJson = (data, name) => {
  // converting the JSON object to a string
  const players = JSON.stringify(data);

  // writing the JSON string content to a file
  fs.writeFile(`${name}.json`, players, (error) => {
    // throwing the error
    // in case of a writing problem
    if (error) {
      // logging the error
      console.error(error);

      throw error;
    }

    console.log(`${name}.json written correctly`);
  });
};
const readJson = (name) => {
  try {
    // reading a JSON file synchronously
    const data = fs.readFileSync(`${name}.json`);
    return JSON.parse(data);
  } catch (error) {
    // logging the error
    console.error(error);

    throw error;
  }
};
const createOrAppend = (data, name) => {
  let payload = [];
  Object.keys(data).forEach((key) => {
    data[key].forEach((client) => {
      payload.push(client);
    });
  });
  if (fs.existsSync(`${name}.json`)) {
    const players = readJson(undefined, undefined, name);
    console.log(players.length);
    payload = [...players, ...payload];
    console.log(payload.length);
  }
  saveJson(payload, name);
};

module.exports = {
  saveJson,
  readJson,
  createOrAppend,
};
