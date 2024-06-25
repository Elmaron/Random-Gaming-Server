const Command = require('./../Structures/Command.js');

//Schickt ein Hallo zurück an den User, der den Befehl ausgeführt hat.
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['hallo']
        })
    }

    async run(message, args) {
        message.channel.send('Hallo!');
    }
}