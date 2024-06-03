const Event = require('../Structures/Event.js');
const { MessageEmbed, UserFlags } = require('discord.js');
//const moment = require('moment');

//Schicke eine Benachrichtigung in einen Text-Channel, sobald jemand in einem bestimmten Voice-Channel live geht.
module.exports = class extends Event{

    async run(oldMember, newMember){
        if(oldMember.channel === oldMember.member.guild.channels.cache.find(ch => ch.name === 'live')) 
            if(oldMember.streaming) 
            if(oldMember.member.roles.cache.find(role => role.name === 'Thatone') === oldMember.guild.roles.cache.find(role => role.name === 'Thatone'))
            {
                //Prüfe if oldMember = new Member oder so, damit es (vermutlich) richtig funktioniert
                const embed = new MessageEmbed()
                .setColor('BLUE')
                .addField('STREAM IS NOW OFFLINE', [
                    `${newMember.member.nickname ? newMember.member.nickname : 'A User'} is now streaming in ${newMember.guild.channels.cache.find(ch => ch.name === 'live')}`,
                    `${newMember.guild.roles.cache.find(role => role.name === 'Mit Glied')} and ${newMember.guild.roles.cache.find(role => role.name === 'Randomizer')}, join and watch it :D`
                ]);
                const channel = newMember.guild.channels.cache.find(ch => ch.name === 'announcements');
                if(channel) channel.send(embed);
                //lösche ggf. die alte Nachricht
                return;
            }
        if(newMember.channel !== newMember.member.guild.channels.cache.find(ch => ch.name === 'live')) return;
        if(!newMember.streaming) return;
        if(newMember.member.roles.cache.find(role => role.name === 'Thatone') !== newMember.guild.roles.cache.find(role => role.name === 'Thatone')) return;
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .addField('STREAM IS ON', [
                `${newMember.member.nickname ? newMember.member.nickname : 'A User'} is now streaming in ${newMember.guild.channels.cache.find(ch => ch.name === 'live')}`,
                `${newMember.guild.roles.cache.find(role => role.name === 'Mit Glied')} and ${newMember.guild.roles.cache.find(role => role.name === 'Randomizer')}, join and watch it :D`
            ]);
        const channel = newMember.guild.channels.cache.find(ch => ch.name === 'announcements');
        if(channel) channel.send(embed);
    }
}

//announcements