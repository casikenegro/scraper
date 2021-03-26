const browserObject = require('./browser');
const scraperController = require('./pageController');
const fileBuilder = require('./fileBuilder');
require('dotenv').config()

const { AG_FILTER, AG_ACTION: action, AG_REQUIREMENTS, AG_FILE_NAME } = process.env;

const parseToArray = (data) => {
    return data.split(',').map(item => item.trim());
}

const filter_parse = parseToArray(AG_FILTER);
const requirements = parseToArray(AG_REQUIREMENTS);
const filter = { agents: filter_parse, action }

console.log(filter);

let browserInstance = browserObject.startBrowser();
scraperController(browserInstance, filter, requirements).then( agents => {
    const fileName = AG_FILE_NAME ? `${AG_FILE_NAME}.xlsx` : 'data.xlsx';
    fileBuilder(agents, fileName, requirements).then(console.log);
}).catch(err => console.error(err));