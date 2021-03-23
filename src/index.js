const browserObject = require('./browser');
const scraperController = require('./pageController');
const fileBuilder = require('./fileBuilder');
require('dotenv').config()

const { AG_TO_IGNORE, AG_REQUIREMENTS, AG_FILE_NAME } = process.env;

const parseToArray = (data) => {
    return data.split(',').map(item => item.trim());
}

const to_ignore = parseToArray(AG_TO_IGNORE);
const requirements = parseToArray(AG_REQUIREMENTS);
let browserInstance = browserObject.startBrowser();

scraperController(browserInstance, to_ignore, requirements).then( agents => {
    const fileName = AG_FILE_NAME ? `${AG_FILE_NAME}.xlsx` : 'data.xlsx';
    fileBuilder(agents, fileName, requirements).then(console.log);
}).catch(err => console.error(err));