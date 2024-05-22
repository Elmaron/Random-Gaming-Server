const fetch = require('node-fetch');
const Event = require('../Structures/Event');
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
		
        let i = 0;
        setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000);
		
		setInterval(sendLiveMessage, 2 * 60 * 1000)
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
			livechannel.send(`${config.RandomGamingServer.Livestream.twitchChannels} ist gerade live!`)
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