const { Client, Collection, Intents } = require('discord.js');
const Util = require('./Util.js');

module.exports = class MenuDocsClient extends Client {
    constructor(options = {}) {
        console.log('MenuDocsClient.js called >> running constructor');
        super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS
			],
            disableMentions: 'everyone'
        });
        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.events = new Collection();
        
        this.utils = new Util(this);

        this.owners = options.owners;
    }


    validate(options) {
        console.log('MenuDocsClient.js called >> validating options');
        if(typeof options !== 'object') throw new TypeError('Options should be type of Object.');

        if(!options.DiscordAPI.token) throw new Error('You must pass the token for the client.');
        this.token = options.DiscordAPI.token;

        if(!options.DiscordAPI.prefix) throw new Error('You must pass a prefix for the client.');
        if(typeof options.DiscordAPI.prefix !== 'string') throw new TypeError('Prefix should be a type of String');
        this.prefix = options.DiscordAPI.prefix;
    }

    async start(token = this.token) {
        console.log('MenuDocsClient.js called >> starting');
        this.utils.loadCommands();
        this.utils.loadEvents();
        super.login(token);
        console.log('MenuDocsClient.js called >> looged in\n_____________________________________________\n\n');
    }

};