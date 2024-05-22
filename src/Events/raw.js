const Event = require('../Structures/Event.js');
const config = require("../../../../SECRET DISCORD ADDITIONS/config.json");

module.exports = class extends Event {
	
	async run(packet) {
		//console.log('Event called!');
		if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return; //, 'MESSAGE_REACTION_REMOVE'
        const { d: data } = packet;
        const user = await this.client.users.fetch(data.user_id);
        const channel = await this.client.channels.fetch(data.channel_id);
        if (!channel || !channel.messages) return;
        const message = await channel.messages.fetch(data.message_id);
		
		//console.log('There has been a reaction!');
		
		this.addRoleOnReaction(message, user, data, config.RandomGamingServer.Guidelines);
		
	}
	
	async addRoleOnReaction(message, user, data, settings)
	{
		if (message.id === settings.messageId) {
			// Überprüfen, ob die Reaktion die gewünschte ist
			if (data.emoji.name === settings.reactionId) {
				try {
					const guild = message.guild;
					const member = await guild.members.fetch(user.id);
					console.log(`User ${user.tag} wird die Rolle ${member.roles.cache.get(settings.roleId)} zugewiesen.`);
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

