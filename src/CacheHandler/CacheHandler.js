const fs = require('fs').promises;

module.exports = class ch {
    constructor(module) {
        this.module = module;
    }

    //Ruft den Cache ab
    async read() {
        try {
            const data = await fs.readFile('./CacheHandler/Cache.json', 'utf8');
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
            await fs.writeFile('./CacheHandler/Cache.json', JSON.stringify(cache, null, 2), 'utf8');
            console.log('Cache erfolgreich aktualisiert');

        } catch (err) {
            console.error('Fehler beim Aktualisieren des Caches: ', err);
        }
    }
}