const scraperObject = {
    url: 'https://agents.redfigures.ag',
    menu: '/Frames/MainFrame.aspx',
    players: '/Report/PlayerManagement.aspx',
    info: '/popup/PlayerMarketingInfo.aspx?Player=',
    async getPlayersId(content){
        return content.split(this.info).slice(1).map(item => item.split("'")[0]);
    },
    async playerInfo(browser, id, requirements) {
        const page = await browser.newPage();
        await page.goto(`${this.url}${this.info}${id}`);

        const content = await page.content();

        const info = requirements.reduce((acc, cur) => {
            const data = content.split(`${cur}:`)[1].split('<')[0].trim();
            acc[cur] = data;
            return acc;
        }, {});

        await page.close();

        return info;
    },
    async managePlayers(browser, requirements) {
        const page = await browser.newPage();
        const players = [];

        await page.goto(`${this.url}${this.players}`);
        await page.waitForSelector('#ctl00_MainContent_UpdatePanelReport');

        const content = await page.content();
        const ids = await this.getPlayersId(content);

        await page.close();

        for (id of ids){
            const player = await this.playerInfo(browser, id, requirements);
            console.log(...requirements.reduce((acc, cur) => {
                acc.push(player[cur]);
                return acc;
            }, []));
            players.push(player);
        }
        return players;
    },
    async scraper({browser, username, password, filter, requirements}) {
        const agentsResult = {};
        const page = await browser.newPage();

        await page.goto(this.url);
        await page.type('#Account', username);
        await page.type('#Password', password);
        await page.click('#login-button');

        console.log('Espere un momento, se esta ingresando a la plataforma...')
        await page.waitForTimeout(10000);

        const url = `${this.url}${this.menu}`;

        if (url === page.url()){
            console.log('Se ha iniciado sesion con exito');
        } else {
            throw 'No se pudo iniciar sesion, revise sus credenciales. Si el problema persiste borre el cache de chronium';
        }

        const frame = await page.frames().find(frame => frame.name() === 'topFrame');

        const agents = (await frame.$$eval('#ddlAgentMenu > option', 
            select => select.map(item => {
                return {text: item.text, value: item.value};
            })
        )).filter(item => {
            let flag;
            if (!filter.action || filter.action === 'NONE') {
                flag = true;
            } else if (filter.action === 'ONLY') {
                flag = filter.agents.includes(item.text);
            } else if (filter.action === 'REJECT') {
                flag = !filter.agents.includes(item.text);
            }
            return item.text.toLowerCase() !== username.toLowerCase() && flag;
        });

        for (const agent of agents){
            await frame.select('select#ddlAgentMenu', agent.value);
            await page.waitForTimeout(100);
            console.log(`\n\nAgente: ${agent.text}`);
            agentsResult[agent.text] = await this.managePlayers(browser, requirements);
        }

        return agentsResult;
    }
}

module.exports = scraperObject;