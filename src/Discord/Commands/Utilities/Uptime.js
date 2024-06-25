const Command = require('../../Structures/Command.js');
const ms = require('ms');

//Zeigt an, wie lange der Bot bereits online ist.
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['ut'],
            description: 'Displays how long the bot is currently on the server.',
            category: 'Utilities'
        });
    }

    async run(message) {
        message.channel.send(`My uptime is \`${ms(this.client.uptime, { long: true })}\``);
    }


}