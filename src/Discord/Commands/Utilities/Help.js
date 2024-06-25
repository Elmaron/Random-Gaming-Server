const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command.js');

//Zeigt alle Befehle in einer Übersicht an. Falls ein bestimmter Befehl mit angegeben wird, werden Informationen zu diesem einen Befehl angezeigt.
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['halp'],
            description: 'Displays information about the commands for the author.',
            category: 'Utilities',
            usage: '[command]'
        });
    }

    async run(message, [command]) {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        if(command) {
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

            if(!cmd) return message.channel.send(`Invalid command named. \`${command}\``);

            embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
            embed.setDescription([
                `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases '}`,
                `**❯ Description:** ${cmd.description}`,
                `**❯ Category:** ${cmd.category}`,
                `**❯ Usage:** ${cmd.usage}`,
            ]);

            return message.channel.send(embed);
        } else {
            embed.setDescription([
                `These are the available commands for ${message.guild.name}`,
                `The bot's prefix is: ${this.client.prefix}`,
                `Command Parameters: \`<>\` ist strict & \`[]\` is optional`
            ]);
            let categories;
            if(!this.client.owners.includes(message.author.id)){
                categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
            } else {
                categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
            }

            for (const category of categories) {
                embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd => 
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(" "));
            }
            return message.channel.send(embed);
        }
    }
}