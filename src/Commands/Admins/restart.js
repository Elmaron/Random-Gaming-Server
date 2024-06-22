const { exec } = require('child_process');
const path = require('path');
const Command = require('../../Structures/Command.js');

//Dieser Chatbefehl kann den Bot aus der ferne neustarten. Erfordert Administratorberechtigungen für den Bot.
module.exports = class extends Command{

    constructor(...args) {
        super(...args, {
            description: 'Shuts down the Bot and restarts it.',
            category: 'Administrator'
        })
    }

    async run(message) {
        if(message.author.id != this.client.owners) return message.channel.send('You\'re not the bot owner!');

        const msg = await message.channel.send('Restarting...');
        console.log('Restarting the Bot in 5 seconds!');
        setTimeout(function() {msg.edit('See you again in just a moment...');}, 4000);
        setTimeout(async function() {
            await msg.edit('Goodbye!');
            try {
                console.log("Starting the restart process");
    
                // Start the PowerShell script
                exec(`powershell.exe -File "${path.resolve(__dirname, '../../start.ps1')}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing script: ${error}`);
                        return msg.edit('Wait... I have a problem! I can\'t restart!');
                    }
                    console.log(`Script output: ${stdout}`);
                    console.error(`Script errors: ${stderr}`);
                });
    
                // Delay process exit to ensure the script starts
                setTimeout(function() {
                    console.log("Shutting down the old process now");
                    process.exit();
                }, 2000);
            } catch (e) {
                console.log(e);
                return msg.edit('Wait... I have a problem! I can\'t restart!');
            }
        }, 5000);
    }
}