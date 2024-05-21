const Event = require('../Structures/Event.js');
const { MessageEmbed, UserFlags } = require('discord.js');
const moment = require('moment');

module.exports = class extends Event{

    async run(member){
        const userflags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .addField('Welcome', [
                `**❯ Username:** ${member.user.username}`,
                `**❯ Discriminator:** ${member.user.discriminator}`,
                `**❯ ID:** ${member.id}`,
                `**❯ Flags:** ${UserFlags.length ? userflags.map(flag => flags[flag]).join('y ') : 'None'}`,
                `**❯ Avatar:** [Link to Avatar](${member.user.displayAvatarURL({ dynamic:true })})`,
                `**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
                `**❯ Status:** ${member.user.presence.status}`,
                `**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
                'It\'s great to have you here :D'
            ]);
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        if(channel) channel.send(embed);
    }
}