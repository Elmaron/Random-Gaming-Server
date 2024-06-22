//Diese Klasse kann als Vorlage importiert werden, um Discord-Events zu verarbeiten.
module.exports = class Event {
    //Hier wird definiert, woraus ein Event des Bots besteht und wie es sich zusammensetzt. Außerdem werden hier (bei nicht vorhandensein bestimmter Parameter) auch die Standardparameter definiert.
    constructor(client, name, options = {}) {
        this.name = name;
        this.client = client;
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter]: options.emitter) || this.client;
    }

    //Wenn keine Methode für run definiert wird, wird dies in der Konsole ausgeworfen.
    async run(...args){
        throw new Error(`The run method has not been implemented in ${this.name}`);
    }

};