const MenuDocsClient = require('./Structures/MenuDocsClient');
const config = require("../../config.json");
const package = require("../package.json");

console.log(`\n-SERVER START-\n\n--RUNNING DISCORD-BOT VERSION ${package.version}--\n\nindex.js called >> running code`);
const client = new MenuDocsClient(config);
client.start();