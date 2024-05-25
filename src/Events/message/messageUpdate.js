const Event = require('../../Structures/Event.js');
const MenuDocsEmbed = require('../../Structures/MenuDocsEmbed.js');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');

module.exports = class extends Event {

    async run(old, message) {
        if(!message.guild || old.content === message.content || message.author.bot) return;
        
        try {
            const embed = new MenuDocsEmbed()
                .setColor('BLUE')
                .setAuthor(old.author.tag, this.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle('Message Updated')
                .setDescription([
                    `**❯ Message ID:** ${old.id}`,
                    `**❯ Channel:** ${old.channel}`,
                    `**❯ Author:** ${old.author.tag} (${old.author.id})`
                ])
                .setURL(old.url)
                .splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
                    .map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
                    .join(' '));

            const channel = message.guild.channels.cache.find(ch => ch.name === 'private-bot-messages');
            if(channel) channel.send(embed);
        } catch(error) {
            console.error("An error occured, while trying to show, how a message on the server has been updated: ", error);
        }
    }

}