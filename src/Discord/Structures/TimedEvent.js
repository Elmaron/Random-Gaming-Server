//Diese Klasse kann verwendet werden, um bestimmte Befehle nach dem Ablauf einer bestimmten Zeitspanne oder zu bestimmten Zeitpunkten ablaufen zu lassen. Sie ist genau wie Command.js und Event.js eine Vorlage.
module.exports = class TimedEvent {
    //Definition der Inhalte eines zeitgesteuerten Ereignisses
    constructor(client, name, options = {}) {
        this.name = name;
        this.client = client;
        this.type = options.timed ? "timestamp" : "timer";
        this.time = options.timed ? options.timestamp : options.timer; //Timestamps: In Minuten Abständen; Timer: In Minuten Abständen 
    }

    //Definition der Methode, die die Befehle ausführen soll. Gibt es keine Inhalte, wird ein Fehlercode ausgeworfen.
    async run(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    }

    //Eine Methode, um auszulesen welche Art von zeitgesteuertem Event dieses hier angehört.
    getType() {
        return this.type;
    }

    //Eine Methode, um die Zeit bis zur nächsten Ausführung (das Intervall) oder den Zeitpunkt zu erhalten.
    getTime() {
        return this.time;
    }
}