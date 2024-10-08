const fetch = require('node-fetch');
const Event = require('../Structures/Event');
const { MessageEmbed } = require('discord.js');
const ch = require('../../CacheHandler/CacheHandler.js');
const config = require("../../../../config.json");
const serverConfig = require("../Config/Server/RANDOM GAMING SERVER.json");
//const twitchConfig = require("../../../../../SECRET DISCORD ADDITIONS/Twitch-API/twitch-config.json");

const cache = new ch('Discord');

let localClient = null;
let liveMessageSent = false;
let livemsg = null;

//Dieses Event wird bei jedem Start des Discord-Bots ausgeführt.
module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    run() {
		//Zeige Informationen zum Bot nach dem Laden in der Konsole an.
        console.log([
			`_______________________________________________\n\n`,
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
		
		localClient = this.client; //Der Client wird gespeichert, um auch außerhalb des Events Zugriff auf ihn zu haben.
		
		//Falls die Guidelines geändert wurden und es noch nicht das zugehörige Emoji auf den Guidelines gibt, füge es an dieser Stelle hinzu.
		(async () => {
			try{
				const channel = await(this.client.channels.fetch(serverConfig.Guidelines.channelId));
				const message = await(channel.messages.fetch(serverConfig.Guidelines.messageId));

				const reactions = message.reactions.cache;
				const reaction = reactions.get(serverConfig.Guidelines.reactionId);

				if(!reaction) {
					await message.react(serverConfig.Guidelines.reactionId);
					console.log('Reaktion für die Guidelines hinzugefügt');
				} else {
					//console.log('Die Reaktion für die Nachricht ist bereits vorhanden!');
				}

			} catch(error) {
				console.error('Fehler beim Reagieren auf die Guidelines: ', error);
			}
		})();

        let i = 0;
        setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000); //Zeige regelmäßig Infos zum Bot und Server.
		
		sendLiveMessage();
		setInterval(sendLiveMessage, 5 * 60 * 1000);

		upgradeRoles();
		setInterval(upgradeRoles, 1000 * 60 * 60 * 8); //die letzte Zahl sind die Stunden
        // this.client.user.setActivity('discord.js', { type: 'WATCHING' });
    }
}

// Funktion, um ein Auth-Token zu erhalten (wird für die Twitch-API benötigt)
/*
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
}*/

//Überprüfe, ob ein Streamer (unter server-config) gerade auf Twitch live ist und schicke ggf. eine Nachricht oder lösche diese, sobald der Nutzer wieder offline ist.
async function sendLiveMessage() {
	const currentCache = await cache.read();
	if(new Date(currentCache.Twitch.checkLiveStatus.updated) <= new Date(currentCache.Discord.TimedEventCache.sendLiveMessage.lastUpdated)) return;
	const data = currentCache.Twitch.checkLiveStatus.streamData.data;
	if(data.length > 0)
	{
		console.log(`${data[0].user_name} is live, streaming ${data[0].title} with ${data[0].viewer_count} viewers.`);
		//console.log("StreamData: ", data);
		const livechannel = await localClient.channels.cache.get(serverConfig.Livestream.announcementChannel);
		if(livechannel) {
			livechannel.send(`[${serverConfig.Livestream.twitchChannels}](https://www.twitch.tv/${serverConfig.Livestream.twitchChannels}) ist gerade live! @everyone , schaut gerne vorbei! ^^\n` +
				`**${data[0].title}** (${data[0].language}) | ${data[0].viewer_count}\n` +
				`*Game/Spiel:* ${data[0].game_name}` //This should work now - 11-07-2022
			)
				.then(message => {livemsg = message;})
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
		} else {
			console.error('Kanal nicht gefunden!')
			
		}
	} else {
		if(livemsg)
			livemsg.delete()
				.then(() => {livemsg = null; console.log('Livestream Benachrichtigung erfolgreich geloescht.')})
				.catch(error => console.error('Fehler beim loeschen der Livestream-Benachrichtigung'));
	}
	const newCache = {
		TimedEventCache: {
		  sendLiveMessage: {
			livemsg: null,
			lastUpdated: new Date().toISOString()
		  }
		}
	  };
	await cache.update(newCache);

	/*
	const livechannel = await localClient.channels.cache.get(serverConfig.Livestream.announcementChannel);
	
	const token = await getAuthToken();
		
	const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${serverConfig.Livestream.twitchChannels}`, {
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
		//console.log(`${serverConfig.Livestream.twitchChannels} ist live!`);
		liveMessageSent = true;
		console.log("StreamData: ", streamData);
		if(livechannel)
		{
			livechannel.send(`[${serverConfig.Livestream.twitchChannels}](https://www.twitch.tv/${serverConfig.Livestream.twitchChannels}) ist gerade live! @everyone , schaut gerne vorbei! ^^\n` +
				`**${streamData.data[0].title}** (${streamData.data[0].language}) | ${streamData.data[0].viewer_count}\n` +
				`*Game/Spiel:* ${streamData.data[0].game_name}` //This should work now - 11-07-2022
			)
				.then(message => {livemsg = message;})
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
		} else {
			console.error('Kanal nicht gefunden!')
		}
	} else if(streamData.data.length <= 0 && liveMessageSent) {
		liveMessageSent = false;
		const streamSchedule = await fetch(`https://api.twitch.tv/helix/schedule?broadcaster_id=${userId}`, {
				headers: {
					'Client-ID': config.TwitchAPI.client_id,
					'Authorization': `Bearer ${token}`
				}
			}).then(response => response.json());
		try
		{
			console.log('Schedule: ', streamSchedule);
		}
		catch (error) {console.error('Fehler beim auslesen des Streamzeitplans: ', error);}
		if(livemsg)
			livemsg.delete()
				.then(() => {livemsg = null; console.log('Livestream Benachrichtigung erfolgreich geloescht.')})
				.catch(error => console.error('Fehler beim loeschen der Livestream-Benachrichtigung'));
	} else {
		//*
		console.log(`${serverConfig.Livestream.twitchChannels} ist nicht live.`);
		if(livechannel)
		{
			livechannel.send("Da ist jemand nicht live.")
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
		} else {
			console.error('Kanal nicht gefunden!')
		}
		///
	}//*/
}

//Verändere die Rollen von Nutzern mit bestimmten Rollen, sobald eine bestimmte Dauer vorbei ist.
async function upgradeRoles() {
	let roles = serverConfig.RoleUpgrades.roles; //Die erste Rolle muss eine Rolle sein, von der aus geupgraded wird
	if(roles.length <= 1) return console.log("Es sind nicht genug Rollen zum upgraden vordefiniert!");
	let passedTime =  serverConfig.RoleUpgrades.passedTime; //ES muss hier einen Eintrag weniger geben, als bei roles
	if(!(roles.length-passedTime.length <= 1)) return console.log("Es gibt zu wenige Angaben für die Zeit, die fuer die einzelnen Rolle vergangen sein muss.");

	const guild = await localClient.guilds.fetch(serverConfig.guildId);
	await guild.members.fetch();

	const advancementsChannel = await localClient.channels.cache.get(serverConfig.advancementsChannel);

	const auditLogs = await guild.fetchAuditLogs({
        type: 'MEMBER_ROLE_UPDATE',
        limit: 100
    })

	for(let i = 0; i < roles.length-1; i++) {
		let membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roles[i]));
		

		console.log(`Es gibt aktuell ${membersWithRole.size} Mitglieder mit der Rolle \"${guild.roles.cache.get(roles[i]).name}\"`);
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
							console.error(`Rolle von ${member.user.tag} konnte nicht geupgraded werden. Fehler: `, error);
						}})();
					}
				}
			}
		});
	}
}