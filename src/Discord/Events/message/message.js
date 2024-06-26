const Event = require('../../Structures/Event.js');

//Dieses Event verarbeitet Nachrichten, die von Nutzern verschickt werden. Duch dieses Event können ggf. Befehle von Nutzern ausgeführt werden.
module.exports = class extends Event {

    async run (message) {
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);
		
		if(!message.guild || message.author.bot) return;

        if(message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\``);

        const prefix = message.content.match(mentionRegexPrefix) ? 
            message.content.match(mentionRegexPrefix)[0] : this.client.prefix; //condition ? true : false
		
		if(!message.content.startsWith(prefix)) return;
		
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if(command) {
            command.run(message, args);
        }
    }

}