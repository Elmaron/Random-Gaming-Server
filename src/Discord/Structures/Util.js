const { cpus } = require('os');
const path = require('path');
const { promisify } = require('util');
const { runInThisContext } = require('vm');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');
const TimedEvent = require('./TimedEvent.js');

//Die Utilklasse enthält viele Methoden zur grundlegenden Verarbeitung bestimmter Anfragen.
module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    //Überprüft, ob die Eingabe eine Klasse ist.
    isClass(input) {
        return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
    }

    //Gibt den aktuellen Pfad einer Datei im System zurück.
    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    //Kürzt ein Array auf eine Länge von 10 und fügt einen Hinweis hinzu, dass es mehr Einträge als angegeben gibt.
    trimArray(arr, maxLen = 10) {
        if(arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    //Gibt Bytes in den passenden Größen formatiert zurück.
    formatBytes(bytes) {
        if(bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    //Löscht Duplikate aus einem String.
    removeDuplicates(str) {
        return [...new Set(str)];
    }

    //Schreibt den Anfangsbuchstaben eines Strings groß.
    capitalise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    //Lädt alle Chatbefehle, die im Ordner "Commands" definiert wurden, in den Arbeitsspeicher des Bots
    async loadCommands() {
        return glob(`${this.directory}Commands/**/*.js`).then(commands => {
            console.log('util.js called >> loading commands');
            console.log(`-- Loading commands from ${this.directory}Commands/**/*.js --`);
            for(const commandFile of commands) {
                //console.log(`-> Found: ${commandFile}`);
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if(!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class!`);
                const command = new File(this.client, name.toLowerCase());
                if(!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commmands.`);
                this.client.commands.set(command.name, command);
                if(command.aliases.length) {
                    for(const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
                //console.log(`-> Loaded: ${command.name}`);
            }
            console.log('util.js called >> commands loaded');
        })
    }

    //Lädt alle Events, die im Ordner "Events" definiert wurden, in den Arbeitsspeicher des Bots
    async loadEvents() {
        return glob(`${this.directory}Events/**/*.js`).then(events => {
            console.log('util.js called >> loading events');
            console.log(`-- Loading events from ${this.directory}Events/**/*.js --`);
            for(const eventFile of events) {
                //console.log(`-> Found: ${eventFile}`);
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if(!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
                const event = new File(this.client, name);
                if(!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in events.`);
                this.client.events.set(event.name, event);
				//console.log(`Registering event: ${name}`);
                event.emitter[event.type](name, (...args) => {/*console.log(`Event ${name} triggered.`); */event.run(...args);});
                //console.log(`-> Loaded: ${event.name}`);
            }
            console.log('util.js called >> events loaded');
        })
    }

    //Lädt alle zeitlich eingestellten Events, die im Ordner "TimedEvents" definiert wurden und startet diese.
    async loadTimed() {
        return glob(`${this.directory}TimedEvents/**/*.js`).then(events => {
            console.log('util.js called >> loading timed');
            console.log(`-- Loading events from ${this.directory}TimedEvents/**/*.js --`);
            for(const eventFile of events) {
                //console.log(`-> Found: ${eventFile}`);
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if(!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
                const event = new File(this.client, name);
                if(!(event instanceof TimedEvent)) throw new TypeError(`Event ${name} doesn't belong in timed events.`);
                
                if(event.getType() == "timer") setInterval(event.run, event.getTime() * 60 * 1000);
                else {
                    const now = new Date();
                    const target = event.getTime().split(':');
                    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(target[0]), parseInt(target[1]));

                    // Falls die Zielzeit bereits vergangen ist, füge einen Tag hinzu
                    if (now > targetTime) {
                        targetTime.setDate(targetTime.getDate() + 1);
                    }

                    const timeout = targetTime.getTime() - now.getTime();

                    setTimeout(() => {
                        event.run();
                        setInterval(event.run, 24 * 60 * 60 * 1000);
                    }, timeout);
                }
                event.run();
            }
            console.log('util.js called >> timed loaded');
        })
    }

};