const pageScraper = require('./pageScraper');

async function scrapeAll(browserInstance, to_ignore, requirements) {
    const {AG_USERNAME: username, AG_PASSWORD: password} = process.env;
    console.log('Agentes a ignorar: ', to_ignore.join(', ') || 'NO IGNORAR...');
    let browser;
    try {
        browser = await browserInstance;
        const result = await pageScraper.scraper({
            browser,
            username,
            password,
            to_ignore,
            requirements
        });
        browser.close();
        return result;
    }
    catch (err) {
        browser.close();
        throw err;
    }
}

module.exports = (browserInstance, to_ignore, requirements) => scrapeAll(browserInstance, to_ignore, requirements);