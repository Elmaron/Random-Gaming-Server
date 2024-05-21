const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['byebye'],
            description: 'The Bot can be shut down with this command.',
            category: 'Administrator'
        });
    }

    async run(message) {
        if(message.author.id != this.client.owners) return message.channel.send('You\'re not the bot owner.');
        const msg = await message.channel.send('Shutting down...');
        console.log("Shutting down the Bot in 5 seconds");
        setTimeout(function() {msg.edit('Goodbye!');}, 5000);
        try{
            setTimeout(function() {console.log("Shutting down the Bot now")}, 5100);
            setTimeout(function() {process.exit();}, 5150);
        } catch(e)
        {
            return msg.edit('Wait... I have a problem! I can\'t go to sleep!');
        }
    }
}