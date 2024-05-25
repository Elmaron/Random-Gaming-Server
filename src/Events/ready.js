const fetch = require('node-fetch');
const Event = require('../Structures/Event');
const { MessageEmbed } = require('discord.js');
const config = require("../../../../SECRET DISCORD ADDITIONS/config.json");
//const twitchConfig = require("../../../../SECRET DISCORD ADDITIONS/Twitch-API/twitch-config.json");

let localClient;
let liveMessageSent = false;
let livemsg = null;

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    run() {
		
		
        console.log([
            `Logged in as ${this.client.user.tag}`,
            `Loaded ${this.client.commands.size} commands!`,
            `Loaded ${this.client.events.size} events!`//,
			//`Bot available on the following servers:`
        ].join('\n'));
		
		//this.client.guilds.cache.forEach(guild => console.log(guild.name));


        const activities = [
            `${this.client.guilds.cache.size} servers!`,
            `${this.client.channels.cache.size} channels!`,
            `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
        ];
		
		localClient = this.client;
		
		(async () => {
			try{
				const channel = await(this.client.channels.fetch(config.RandomGamingServer.Guidelines.channelId));
				const message = await(channel.messages.fetch(config.RandomGamingServer.Guidelines.messageId));

				const reactions = message.reactions.cache;
				const reaction = reactions.get(config.RandomGamingServer.Guidelines.reactionId);

				if(!reaction) {
					await message.react(config.RandomGamingServer.Guidelines.reactionId);
					console.log('Reaktion für die Guidelines hinzugefügt');
				} else {
					//console.log('Die Reaktion für die Nachricht ist bereits vorhanden!');
				}

			} catch(error) {
				console.error('Fehler beim Reagieren auf die Guidelines: ', error);
			}
		})();

        let i = 0;
        setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000);
		
		setInterval(sendLiveMessage, 2 * 60 * 1000);

		setInterval(upgradeRoles, 1000 * 60 * 60 * 6); //die letzte Zahl sind die Stunden
        // this.client.user.setActivity('discord.js', { type: 'WATCHING' });
    }
}

// Funktion, um ein Auth-Token zu erhalten
async function getAuthToken() {
  const authResponse = await fetch('https://id.twitch.tv/oauth2/token', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: new URLSearchParams({
	  client_id: config.TwitchAPI.client_id,
	  client_secret: config.TwitchAPI.client_secret,
	  grant_type: 'client_credentials'
	}).toString()
  });

  const authData = await authResponse.json();
  return authData.access_token;
}

async function sendLiveMessage() {
	const livechannel = await localClient.channels.cache.get(config.RandomGamingServer.Livestream.announcementChannel);
	
	const token = await getAuthToken();
		
	const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${config.RandomGamingServer.Livestream.twitchChannels}`, {
		headers: {
		  'Client-ID': config.TwitchAPI.client_id,
		  'Authorization': `Bearer ${token}`
		}
	});
	
	const userData = await userResponse.json();
	const userId = userData.data[0].id;
	
	const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
		headers: {
		  'Client-ID': config.TwitchAPI.client_id,
		  'Authorization': `Bearer ${token}`
		}
	});
	
	const streamData = await streamResponse.json();
	
	if (streamData.data.length > 0 && !liveMessageSent) {
		//console.log(`${config.RandomGamingServer.Livestream.twitchChannels} ist live!`);
		liveMessageSent = true;
		if(livechannel)
		{
			livechannel.send(`[${config.RandomGamingServer.Livestream.twitchChannels}](https://www.twitch.tv/${config.RandomGamingServer.Livestream.twitchChannels}) ist gerade live! Schaut gerne vorbei ^^`)
				.then(message => {livemsg = message;})
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
		} else {
			console.error('Kanal nicht gefunden!')
		}
	} else if(streamData.data.length <= 0 && liveMessageSent) {
		liveMessageSent = false;
		if(livemsg)
			livemsg.delete()
				.then(() => {livemsg = null; console.log('Livestream Benachrichtigung erfolgreich geloescht.')})
				.catch(error => console.error('Fehler beim loeschen der Livestream-Benachrichtigung'));
	} else {
		/*
		console.log(`${config.RandomGamingServer.Livestream.twitchChannels} ist nicht live.`);
		if(livechannel)
		{
			livechannel.send("Da ist jemand nicht live.")
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
		} else {
			console.error('Kanal nicht gefunden!')
		}
		*/
	}
}

async function upgradeRoles() {
	let roles = config.RandomGamingServer.RoleUpgrades.roles; //Die erste Rolle muss eine Rolle sein, von der aus geupgraded wird
	if(roles.length <= 1) return console.log("Es sind nicht genug Rollen zum upgraden vordefiniert!");
	let passedTime =  config.RandomGamingServer.RoleUpgrades.passedTime; //ES muss hier einen Eintrag weniger geben, als bei roles
	if(!(roles.length-passedTime.length <= 1)) return console.log("Es gibt zu wenige Angaben für die Zeit, die fuer die einzelnen Rolle vergangen sein muss.");

	const guild = await localClient.guilds.fetch(config.RandomGamingServer.guildId);
	await guild.members.fetch();

	const advancementsChannel = await localClient.channels.cache.get(config.RandomGamingServer.advancementsChannel);

	const auditLogs = await guild.fetchAuditLogs({
        type: 'MEMBER_ROLE_UPDATE',
        limit: 100
    })

	for(let i = 0; i < roles.length-1; i++) {
		let membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roles[i]));

		console.log(`Es gibt aktuell ${membersWithRole.size} Mitglieder mit der Rolle ${roles[i]}`);
		membersWithRole.forEach(member => {
			if(!(member.roles.cache.get(roles[i+1]))) 
			{
				const roleAddLog = auditLogs.entries.find(entry => {
					return entry.target.id === member.id && entry.changes.some(change => change.key === '$add' && change.new.find(role => role.id === roles[i]));
				});

				if(roleAddLog) {
					const addedAt = roleAddLog.createdAt;
					const now = new Date();
					const duration = (now - addedAt)/ (1000 * 60 * 60 * 24) //(1000 * 60 * 60 * 24); //Dauer in tagen

					if(duration >= passedTime[i]) {
						(async () => { try {
							await member.roles.add(roles[i+1]);
							if(i != 0) await member.roles.remove(roles[i]);
							if(advancementsChannel) {
								const embed = new MessageEmbed()
									.setColor('GREEN')
									.addField('RoleUpgrade', [
										`Hey, **@${member.user.username}**!`,
										`Sieht so aus, als waerst du nun schon fuer etwa ${Math.floor(duration)} Tagen ein *${member.roles.cache.get(roles[i]).name}*!`,
										`Um das zu feiern habe ich deine Rolle geupgraded! Ab sofort bist du nun ein **${guild.roles.cache.get(roles[i+1]).name}**!`,
										`Herzlichen Glückwunsch! ^^`
									]);
								advancementsChannel.send(embed);
							}
						} catch(error)	{
							console.error(`Rolle von ${member.user.tag} konnte nicht richtig geupgraded werden. Fehler: `, error);
						}})();
					}
				}
			}
		});
	}
}