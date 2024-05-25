const Event = require('../../Structures/Event.js');
const MenuDocsEmbed = require('../../Structures/MenuDocsEmbed.js');

module.exports = class extends Event {
    async run(message) {
        if(!message.guild || message.author.bot) return;
        try {
            const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
            const embed = new MenuDocsEmbed()
                .setColor('BLUE')
                .setAuthor(message.author.tag, this.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle('Message Deleted')
                .setDescription([
                    `**❯ Message ID:** ${message.id}`,
                    `**❯ Channel:** ${message.channel}`,
                    `**❯ Author:** ${message.member.displayName}`,
                    `${attachments ? `**❯ Attachements:** ${attachments.join('\n')}` : ''}`
                ]);
            if(message.content.length) {
                embed.splitFields(`**❯ Deleted Message:** ${message.content}`)
            }

            const channel = message.guild.channels.cache.find(ch => ch.name === 'private-bot-messages');
            if(channel) channel.send(embed);
        } catch(error) {
            console.error("An error occured while trying to show, what message has been deleted: ", error);
        }
    }
}