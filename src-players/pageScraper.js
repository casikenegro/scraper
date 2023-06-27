const { createOrAppend, readJson } = require("./file");

require("dotenv").config();

const scraperObject = {
  url: "https://agents.redfigures.ag",
  menu: "/Frames/MainFrame.aspx",
  players: "/Report/PlayerManagement.aspx",
  info: "/popup/PlayerMarketingInfo.aspx?Player=",
  async getPlayersId(content) {
    const data = content
      .split(this.info)
      .slice(1)
      .map((item) => {
        if (
          item.split("'")[3].split(">")[1].split("<")[0].includes("BA") ||
          item.split("'")[3].split(">")[1].split("<")[0].includes("ba")
        ) {
          return item.split("'")[0];
        }
        return undefined;
      });
    console.log(data.length);
    const response = data.filter((item) => item != undefined);
    console.log(response.length);
    return response;
  },
  async playerInfo(browser, id, requirements) {
    const page = await browser.newPage();
    await page.goto(`${this.url}${this.info}${id}`);
    await page.waitForTimeout(100);

    const content = await page.content();

    const info = requirements.reduce((acc, cur) => {
      const data = content.split(`${cur}:`)[1].split("<")[0].trim();
      acc[cur] = data;
      return acc;
    }, {});

    await page.close();

    return info;
  },
  async htmlOnly(page) {
    await page.setRequestInterception(true); // enable request interception

    page.on("request", (req) => {
      if (
        !["document", "xhr", "fetch", "script"].includes(req.resourceType())
      ) {
        return req.abort();
      }
      req.continue();
    });
  },
  async managePlayers(browser, requirements, numbers) {
    console.log("players");
    const page = await browser.newPage();
    await this.htmlOnly(page);
    console.log("html only");
    await page.setDefaultNavigationTimeout(30000);
    const init = numbers.init;
    const end = numbers.end;
    const ids = readJson("dataFiltrada-v2");
    for (let index = init; index < end; index++) {
      if (ids.includes(`${index}`)) continue;
      const player = await this.playerInfo(browser, index, requirements);
      if (!player) continue;
      console.log(index, JSON.stringify(player));
      if (player["Player"] != "") {
        createOrAppend(player, "data3");
      }
    }
  },
  async scraper({
    browser,
    username,
    password,
    filter,
    requirements,
    numbers,
  }) {
    const page = await browser.newPage();
    await this.htmlOnly(page);
    await page.goto(this.url, { waitUntil: "domcontentloaded" });
    await page.type("#Account", username);
    await page.type("#Password", password);
    await page.click("#login-button");

    console.log("Espere un momento, se esta ingresando a la plataforma...");
    await page.waitForTimeout(10000);

    const url = `${this.url}${this.menu}`;

    if (url === page.url()) {
      console.log("Se ha iniciado sesion con exito");
    } else {
      throw "No se pudo iniciar sesion, revise sus credenciales. Si el problema persiste borre el cache de chronium";
    }

    const frame = await page
      .frames()
      .find((frame) => frame.name() === "topFrame");

    const agents = (
      await frame.$$eval("#ddlAgentMenu > option", (items) =>
        items.map((item) => {
          return { text: item.text, value: item.value };
        })
      )
    ).filter((item) => {
      let flag;
      if (!filter.action || filter.action === "NONE") {
        flag = true;
      } else if (filter.action === "ONLY") {
        flag = filter.agents.includes(item.text);
      } else if (filter.action === "REJECT") {
        flag = !filter.agents.includes(item.text);
      }
      return item.text.toLowerCase() !== username.toLowerCase() && flag;
    });
    const agentsResult = {};

    for (const agent of agents) {
      await frame.select("select#ddlAgentMenu", agent.value);
      await page.waitForTimeout(100);
      console.log(`\n\nAgente: ${agent.text}`);
      agentsResult[agent.text] = await this.managePlayers(
        browser,
        requirements,
        numbers
      );
    }
  },
};

module.exports = scraperObject;
