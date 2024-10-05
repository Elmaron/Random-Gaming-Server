const fs = require('fs').promises;
const path = require('path');

module.exports = class ch {
    constructor(module) {
        this.module = module;
        this.path = path.join(__dirname, 'Cache.json');
    }

    //Ruft den Cache ab
    async read() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Fehler beim Lesen des Caches: ', err);
            throw err;
        }
    }

    //Speichert Daten in den zugelassenen Cache-Bereich
    async update(data) {
        try {
            
            //alten Cache lesen
            let cache = await this.read();

            //Cache aktualisieren
            cache[this.module] = { ...data };

            //Cache schreiben
            await fs.writeFile(this.path, JSON.stringify(cache, null, 2), 'utf8');
            console.log('Cache erfolgreich aktualisiert');

        } catch (err) {
            console.error('Fehler beim Aktualisieren des Caches: ', err);
        }
    }
}