const config = require("../../../config.json");
const tmi = require('tmi.js');
const ch = require('../CacheHandler/CacheHandler.js');

const cache = new ch('Twitch');

let client;
let isLive = true;
let channelName = 'ElmaronStanford';

async function checkLiveStatus() {
  try {
      const token = await getAuthToken();
      
      const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=ElmaronStanford`, {
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
      const live = streamData.data.length > 0;

      // Wenn der Status sich ändert
      if ((!live && !isLive) || (live && isLive)) return;

      const Update = {
        checkLiveStatus:
        {
            updated: new Date().toISOString(),
            streamData: 
            {
                data: streamData.data
            }
        }
      };
      cache.update(Update);
      console.log(`${channelName}: Der Livestream Status wurde aktualisiert.`);
      isLive = !isLive;
  } catch (error) {
      console.error('Error checking live status:', error);
  }
}

checkLiveStatus();
setInterval(checkLiveStatus, 5 * 30 * 1000);

(async () => {
  try {
    //const token = await getAuthToken();
    const opts = {
        identity: {
            username: 'rgs_bot',
            password: `oauth:${config.TwitchAPI.access_token}`
          },
          channels: [
            'ElmaronStanford'
          ]
    }

    client = new tmi.client(opts);

    //Methoden definieren, die bei bestimmten Events auftreten sollen.
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    //client.on('connect', onConnectHandler);
    client.on('disconnected', onDisconnectedHandler);
    client.on('connectFailed', onConnectFailedHandler);

    //Damit verbindet sich der Bot mit Twitch.
    await client.connect('ws://irc-ws.chat.twitch.tv:80');
  } catch (err) {
    console.error('Error connecting to Twitch: ', err);
  }
})();

// Funktion, um ein Auth-Token zu erhalten (wird für die Twitch-API benötigt)
async function getAuthToken() {
  try {
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

    if (!authResponse.ok) {
      throw new Error(`Failed to fetch token: ${authResponse.statusText}`);
    }
  
    const authData = await authResponse.json();
    return authData.access_token;
  } catch (err) {
    console.error('Error fetching auth token: ', err);
    throw err; //Weiter werfen, um im Hauptblock behandelt zu werden.
  }
}

//Wird ausgeführt, wenn eine Nachricht in den Chat geschrieben wird.
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } //Ignoriere Nachrichten vom Bot selbst.

    const commandName = msg.trim();

    //Wirf einen Würfel, falls es der richtige Befehl ist.
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

//Function um einen Würfel zu werfen.
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

//Diese Funktion wird jedes Mal aufgerufen, wenn sich der Bot mit Twitch verbindet.
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

//Diese Funktion wird jedes Mal aufgerufen, wenn sich der Bot mit dem Twitch-Chat verbinden will.
function onConnectHandler (connection) {
  console.log('WebSocket Client Connected');

  connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
  connection.sendUTF(`PASS oauth:${opts.identity.password}`);
  connection.sendUTF(`NICK ${opts.identity.username}`);
}

//Diese Funktion wird jedes Mal aufgerufen, wenn der Bot die Verbindung zu Twitch trennt.
function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`);
}

//Diese Funktion wird jedes Mal aufgerufen, wenn der Bot keine Verbindung zu Twitch herstellen kann.
function onConnectFailedHandler(error) {
  console.log(`Connect Error: ${error.toString()}`);
}
