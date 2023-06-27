const pageScraper = require("./pageScraper");

async function scrapeAll(browserInstance, filter, requirements, numbers) {
  const { AG_USERNAME: username, AG_PASSWORD: password } = process.env;
  console.log("Agentes: ", filter.agents.join(", ") || "NO HAY AGENTES...");
  console.log("Accion: ", filter.action || "NONE");
  let browser;
  try {
    browser = await browserInstance;
    const result = await pageScraper.scraper({
      browser,
      username,
      password,
      filter,
      requirements,
      numbers,
    });
    browser.close();
    return result;
  } catch (err) {
    browser.close();
    throw err;
  }
}

module.exports = (...args) => scrapeAll(...args);
