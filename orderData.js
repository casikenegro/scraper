const { readJson, saveJson } = require("./src/file");
const _ = require("lodash");

const players = readJson("data");
data = _.entries(players);
data = Object.values(data[0][1]).flat(2);
data = _.uniq(data);
data.sort((a, b) => a - b);
saveJson(data, "dataFiltrada-v2");
