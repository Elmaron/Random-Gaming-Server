const MenuDocsClient = require('./Structures/MenuDocsClient');
const config = require("../../config.json");
const package = require("../package.json");

//Initialisiere den Discord-Bot durch aufraufen einer Klasse, die den Bot lädt
console.log(`\n -SERVER START-\n\n--RUNNING DISCORD-BOT VERSION ${package.version}--\n\nInitializing Bot...`);
const client = new MenuDocsClient(config);

//Starte den Bot
console.log(`\nBot initializing process completed.\nStarting client...`);
client.start();