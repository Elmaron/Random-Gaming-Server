const MenuDocsClient = require('./Structures/MenuDocsClient');
const config = require("../../config.json");

console.log('index.js called >> running code');
const client = new MenuDocsClient(config);
client.start();