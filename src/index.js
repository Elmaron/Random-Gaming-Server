const MenuDocsClient = require('./Structures/MenuDocsClient');
const config = require("../../../SECRET DISCORD ADDITIONS/config.json");

const client = new MenuDocsClient(config);
client.start();