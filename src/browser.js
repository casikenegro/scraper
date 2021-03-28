const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log("Iniciando proceso, por favor espere...");
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};