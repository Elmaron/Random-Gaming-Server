const path = require('path');
const { spawn } = require('child_process');

let critErr = [0, 0];
// Funktion zum Starten eines Bots
function startBot(scriptPath, botName, botnumber) {
  const bot = spawn('node', [scriptPath]);

  //Wenn der Bot etwas ausgeben möchte, wird das durch die folgenden Zeile verarbeitet.
  bot.stdout.on('data', (data) => {
    console.log(`[${botName}] ${data}`);
  });

  //Wenn der Bot eine Fehlermeldung ausgeben möchte, wird das durch die folgende Zeile ausgegeben.
  bot.stderr.on('data', (data) => {
    console.error(`[${botName} ERROR] ${data.toString()}`);
  });

  //Wenn sich der Bot schließt oder das Programm beendet wird, wird dies mit der folgenden Zeile an das Hauptprogramm weitergegeben.
  bot.on('close', (code) => {
    console.log(`[${botName}] process exited with code ${code}`);
    critErr[botnumber]++;
    if(critErr[botnumber] > 10) return console.log(`critical error limit for ${botName} reached. Shutting down module...`);
    console.log(`Restarting module ${botName}...`);
    startBot(scriptPath, botName, botnumber);
  });

  return bot;
}

// Pfade zu den Bot-Skripten
const botDiscordPath = path.join(__dirname, 'Discord/index.js'); //`${path.dirname(require.main.filename)}${path.sep}Discord/index.js`; 
const botTwitchPath = path.join(__dirname, 'Twitch/index.js'); //`${path.dirname(require.main.filename)}${path.sep}Twitch/index.js`;

// Starten des Discord- und Twitch-Bots
const botDiscord = startBot(botDiscordPath, 'Discord', 0);
const botTwitch = startBot(botTwitchPath, 'Twitch', 1);

setInterval(() => {
  for(let i = 0; i < 2; i++)
    if(critErr[i] > 0) critErr[i]--;
}, 10 * 60 * 1000);