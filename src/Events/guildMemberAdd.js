const Event = require('../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const config = require("../../../../SECRET DISCORD ADDITIONS/config.json");

module.exports = class extends Event{

    async run(member){
        if(member.user.bot) {
            const channel = member.guild.channels.cache.get(config.RandomGamingServer.welcomeChannel);
            if(channel) return channel.send(`Willkommen, werter Herr Kollege! Es ist schön, Sie hier zu sehen!`);
        }
        const choices = ['Es ist schön, dich hier zu haben :smile:', 'Danke, das du dem Server beigetreten bist :heart_hands:', 'Es ist klasse, dich hier zu sehen :upside_down:'];
        const response = choices[Math.floor(Math.random()*choices.length)];
        const linkToGuidelines = `https://discord.com/channels/{${config.RandomGamingServer.guildId}}/${config.RandomGamingServer.Guidelines.channelId}/${config.RandomGamingServer.Guidelines.messageId}`;

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .addField('Welcome', [
                `Willkommen, **${member.user.username}**!`,
                `${response}`,
                `\nFalls du einen Moment Zeit hast, wäre es cool, wenn du dir einmal die [Richtlinien](${linkToGuidelines}) durchlesen und akzeptieren könntest, um das volle Erlebnis des Servers genießen zu können!`
            ]);
        const channel = member.guild.channels.cache.get(config.RandomGamingServer.welcomeChannel);
        if(channel) channel.send(embed);
    }
}