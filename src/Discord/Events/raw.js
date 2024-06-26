const Event = require('../Structures/Event.js');
const serverConfig = require("../Config/Server/RANDOM GAMING SERVER.json");

//Bestimmte Dinge auf dem Server erfordern die Verarbeitung durch die Rohdaten, die Discord abschickt, wenn etwas auf dem Server passiert. Dieses Event kann diese Rohdaten verarbeiten.
module.exports = class extends Event {
	
	async run(packet) {
		//Der Weitere Verlauf der Methode wird nur ausgeführt, wenn es sich bei der Aktion auf dem Discord-Server um eine Reaktion handelt.
		if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return; //, 'MESSAGE_REACTION_REMOVE'
        const { d: data } = packet;
        const user = await this.client.users.fetch(data.user_id);
        const channel = await this.client.channels.fetch(data.channel_id);
        if (!channel || !channel.messages) return;
        const message = await channel.messages.fetch(data.message_id);
		
		//console.log('There has been a reaction!');
		
		this.addRoleOnReaction(message, user, data, serverConfig.Guidelines);
		
	}
	
	//Falls jemand auf eine bestimmte Nachricht mit einem bestimmten Emoji reagiert, wird dieser Person eine bestimmte Rolle zugewiesen.
	async addRoleOnReaction(message, user, data, settings)
	{
		if (message.id === settings.messageId) {
			// Überprüfen, ob die Reaktion die gewünschte ist
			if (data.emoji.name === settings.reactionId) {
				try {
					const guild = message.guild;
					const member = await guild.members.fetch(user.id);
					if(member.user.bot) return console.log(`Bot ${user.tag} hat auf mit dem Emoji auf eine Nachricht reagiert, bei dem eine Rolle zugewiesen werden wuerde. (Bots bekommen sollen keine Rollen bei Reaktionen zugewiesen bekommen)`);
					console.log(`User ${user.tag} wird die Rolle ${guild.roles.cache.get(settings.roleId).name} zugewiesen.`);
					await member.roles.add(settings.roleId);
					console.log('Rolle erfolgreich hinzugefügt.');
				} catch (error) {
					console.error('Fehler beim Hinzufügen der Rolle: ', error);
				}
			} else {
			//console.log('Reaction ID did not match.');
			//console.log('Reaction ID of message: ', data.emoji.name);
			//console.log('Expected Reaction ID: ', settings.reactionId);
			}
		} else {
		//console.log('Message ID did not match.');
		}
	}
	
}

