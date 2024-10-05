const TimedEvent = require('../Structures/TimedEvent.js');
const serverConfig = require("../Config/Server/RANDOM GAMING SERVER.json");
const ch = require ("../../CacheHandler/CacheHandler.js");
const fs = require('fs');
const cache = new ch("Discord");


module.exports = class extends TimedEvent {
    constructor(...args) {
        super(...args, {
            timed: false,
            timer: 20 //Alle 5 Minuten wird einmal dieser Befehl ausgeführt.
        });
    }

    async run() {
        //Prüfe, ob im Cache ein Update zum Livestream vorliegt. Liegt keines vor, wird der Code hier abgebrochen.
        let currentCache = await cache.read();

        if(new Date(currentCache.Twitch.checkLiveStatus.updated) <= new Date(currentCache.Discord.TimedEventCache.sendLiveMessage.lastUpdated)) return;

        let livemsg = currentCache.Discord.TimedEventCache.sendLiveMessage.message;

        const data = currentCache.Twitch.checkLiveStatus.streamData.data;
        const livechannel = await this.client.channels.cache.get(serverConfig.Livestream.announcementChannel);

        //Verschicke die Nachricht, falls der Kanal live ist und der Discord-Channel existiert, in den die Nachricht geschickt werden soll.
        if(data.length > 0 && livechannel) {
            livechannel.send(`[${serverConfig.Livestream.twitchChannels}](https://www.twitch.tv/${serverConfig.Livestream.twitchChannels}) ist gerade live! @everyone , schaut gerne vorbei! ^^\n` +
				`**${data.title}** (${data.language}) | ${data.viewer_count}\n` +
				`*Game/Spiel:* ${data.game_name}` //This should work now - 11-07-2022
			)
				.then(message => {livemsg = message;})
				.catch(error => console.log('Fehler beim Senden der Livestream-Benachrichtigung: ', error));
        } else if(data.length <= 0) //Löscht die Livestream-Benachrichtigung, falls der Stream offline geht.
        {
            if(livemsg)
                livemsg.delete()
				.then(() => {livemsg = null; console.log('Livestream Benachrichtigung erfolgreich geloescht.')})
				.catch(error => console.error('Fehler beim loeschen der Livestream-Benachrichtigung'));
        }

        //Aktualisieren des Cache
        const newCache = {
            TimedEventCache: {
              sendLiveMessage: {
                message: livemsg,
                lastUpdated: new Date().toISOString()
              }
            }
          };
        await cache.update(newCache);
    }
}

//Code kann erst verwendet werden, wenn das Twitch-Modul fertig konfiguriert wurde.
//CODE IST NOCH NICHT FERTIG; MIT ready.js ABGLEICHEN!