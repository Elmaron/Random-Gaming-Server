const { MessageEmbed, UserFlags } = require('discord.js');
const Command = require('../../Structures/Command.js');
const moment = require('moment');

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydney: 'Sydney',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

//Zeigt Informationen über einen bestimmten Nutzer auf dem Server an. 
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['user', 'ui'],
            description: 'Displays information about a provided user or the message author.',
            category: 'Information',
            usage: '[user]'
        });
    }

    async run(message, [target]) {
        const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userflags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(member.displayHexColor || 'BLUE')
            .addField('User', [
                `**❯ Username:** ${member.user.username}`,
                `**❯ Discriminator:** ${member.user.discriminator}`,
                `**❯ ID:** ${member.id}`,
                `**❯ Flags:** ${UserFlags.length ? userflags.map(flag => flags[flag]).join('y ') : 'None'}`,
                `**❯ Avatar:** [Link to Avatar](${member.user.displayAvatarURL({ dynamic:true })})`,
                `**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
                `**❯ Status:** ${member.user.presence.status}`,
                `**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
                '\u200b'
            ])
            .addField('Member', [
                `**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
                `**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
                `**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
                `**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length >= 10 ? this.client.utils.trimArray(roles) : 'None'}`,
                '\u200b'
            ]);
        return message.channel.send(embed);
    }
}