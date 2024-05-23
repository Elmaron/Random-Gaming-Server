const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'The Bot can reload single commands this command.',
            category: 'Administrator',
            usage: '[name]'
        });
    }

    async run(message, args) {
        if(message.author.id != this.client.owners) return message.channel.send('You\'re not the bot owner.');

        if(!args[0]) return message.channel.send('Please provide a command to reload!');
        
        let commandName = args[0].toLowerCase()

        try {
            delete require.cache[require.resolve(`./${commandName}.js`)]
            bot.commands.delete(commandName);
            const pull = require(`./${commandName}`)
            bot.commands.set(commandName, pull)
        } catch(e) {
            return message.channel.send(`Could not reload: \'${args[0].toUpperCase()}\'`)
        }
        message.channel.send(`The command \'${args[0].toUpperCase()}\' has been reloaded`)
    }
}