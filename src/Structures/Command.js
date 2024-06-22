//Diese Klasse kann als Vorlage importiert werden um Chatbefehle zu erstellen.
module.exports = class Command {
    //Hier wird definiert, woraus ein Befehl des Bots besteht und wie er sich zusammensetzt. Außerdem werden hier (bei nicht vorhandensein bestimmter Parameter) auch die Standardparameter definiert.
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || 'No description provided.'
        this.category = options.category || 'Miscellanous';
        this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
    }

    //Wenn keine Methode für run definiert wird, wird dies in der Konsole ausgeworfen.
    async run(message, grgs) {
        throw new Error(`Command ${this.name} doesn't provide a run method!`)
    }
}