const fetch = require('node-fetch');
const TimedEvent = require("../Structures/TimedEvent");
const { MessageEmbed } = require('discord.js')
const serverConfig = require("../Config/Server/RANDOM GAMING SERVER.json");

module.exports = class extends TimedEvent {
    constructor(...args){
        super(...args, {
            timed: true,
            timestamp: '08:00'
        });
    }

    async run(){
        return;
        let roles = serverConfig.RoleUpgrades.roles; //Die erste Rolle muss eine Rolle sein, von der sich die Mitgliederrolle upgraden lassen kann.
        if(roles.length <= 1) return console.log("Es sind nicht genug Rollen zum upgraden vordefiniert!");
        let passedTime = serverConfig.RoleUpgrades.passedTime; //Die Anzahl der Einträge muss einen kleiner sein, als bei roles
        if(!(roles.length-passedTime.length <= 1)) return console.log("Es gibt zu wenige Angaben für die Zeit, die fuer die einzelnen Rollen vergangen sein muss.");

        const guild = await this.client.guilds.fetch(serverConfig.guildId);
        await guild.members.fetch();

        const advancementsChannel = await this.client.channels.cache.get(serverConfig.advancementsChannel);

        const auditLogs = await guild.fetchAuditLogs({
            type: 'MEMBER_ROLE_UPDATE',
            limit: 100
        })

        for(let i = 0; i < roles.length-1; i++) {
            let membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roles[i]));

            console.log(`Es gibt aktuell ${membersWithRole.size} Mitglieder mit der Rolle \"${guild.roles.cache.get(roles[i]).name}\".`);
            membersWithRole.forEach(member => {
                upgrade(member, i, auditLogs, advancementsChannel);
            });
        }
    }

    async upgrade(member, position, auditLogs, advancementsChannel){
        if(member.roles.cache.get(roles[position+1])) return;

        const roleAddLog = auditLogs.entries.find(entry => {
            return entry.target.id === member.id && entry.changes.some(change => change.key === '$add' && change.new.find(role => role.id === roles[position]));
        })
        if(!roleAddLog) return;
        
        const duration = ((new Date()) - roleAddLog.createdAt) / (86400000) //(1000 * 60 * 60 * 24); //Dauer in Tagen
        if(duration < passedTime[position]) return;

        try {
            await member.roles.add(roles[position+1]);
            if(position != 0) await member.roles.remove(roles[position]);
            if(advancementsChannel) {
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .addField('RoleUpgrade', [
                        `Hey, **@${member.user.username}**!`,
                        `Sieht so aus, als waerst du nun schon fuer etwa ${Math.floor(duration)} Tagen ein *${member.roles.cache.get(roles[position]).name}*!`,
                        `Um das zu feiern habe ich deine Rolle geupgraded! Ab sofort bist du nun ein **${guild.roles.cache.get(roles[position+1]).name}**!`,
                        `Herzlichen Glückwunsch! ^^`
                    ]);
                advancementsChannel.send(embed);
            }
        } catch(error) {
            console.error(`Rolle von ${member.user.tag} konnte nicht geupgraded werden. Fehler: `, error);
        };
    }
}