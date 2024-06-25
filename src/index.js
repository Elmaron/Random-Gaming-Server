const { spawn } = require('child_process');

// Funktion zum Starten eines Bots
function startBot(scriptPath, botName) {
  const bot = spawn('node', [scriptPath]);

  //Wenn der Bot etwas ausgeben möchte, wird das durch die folgenden Zeile verarbeitet.
  bot.stdout.on('data', (data) => {
    console.log(`[${botName}] ${data}`);
  });

  //Wenn der Bot eine Fehlermeldung ausgeben möchte, wird das durch die folgende Zeile ausgegeben.
  bot.stderr.on('data', (data) => {
    console.error(`[${botName} ERROR] ${data}`);
  });

  //Wenn sich der Bot schließt oder das Programm beendet wird, wird dies mit der folgenden Zeile an das Hauptprogramm weitergegeben.
  bot.on('close', (code) => {
    console.log(`[${botName}] process exited with code ${code}`);
  });

  return bot;
}

// Pfade zu den Bot-Skripten
const botDiscordPath = './src/Discord/index.js'; 
const botTwitchPath = './src/Twitch/index.js';

// Starten der Bots
const botDiscord = startBot(botDiscordPath, 'Discord');
//const botTwitch = startBot(botTwitchPath, 'Twitch');
