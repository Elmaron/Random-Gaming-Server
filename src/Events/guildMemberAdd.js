const Event = require('../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const serverConfig = require("../../server-config/RANDOM GAMING SERVER.json");

//Wenn jemand neues dem Server joined, wird dem Nutzer eine Willkommensnachricht mit weiteren Informationen zugeschickt. 
module.exports = class extends Event{

    async run(member){
        if(member.user.bot) {
            const channel = member.guild.channels.cache.get(serverConfig.welcomeChannel);
            if(channel) return channel.send(`Willkommen, werter Herr Kollege! Es ist schön, Sie hier zu sehen!`);
        }
        const choices = ['Es ist schön, dich hier zu haben :smile:', 'Danke, das du dem Server beigetreten bist :heart_hands:', 'Es ist klasse, dich hier zu sehen :upside_down:'];
        const response = choices[Math.floor(Math.random()*choices.length)];
        const linkToGuidelines = `https://discord.com/channels/${serverConfig.guildId}/${serverConfig.Guidelines.channelId}/${serverConfig.Guidelines.messageId}`;
        //Müsste in etwa so gehen: https://discord.com/channels/583690456953782272/1239171449999331359/message-id

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .addField('Welcome', [
                `Willkommen, **${member.user.username}**!`,
                `${response}`,
                `\nFalls du einen Moment Zeit hast, wäre es cool, wenn du dir einmal die [Richtlinien](${linkToGuidelines}) durchlesen und akzeptieren könntest, um das volle Erlebnis des Servers genießen zu können!`
            ]);
        const channel = member.guild.channels.cache.get(serverConfig.welcomeChannel);
        if(channel) 
            {
                await delay(5000);
                channel.send(embed);
            }
    }
}

//Eine Funktion, die etwas innerhalb einer Async-Funktion verzögert. Kann dafür verwendet werden, bestimmte Befehle später ausführen zu lassen.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));