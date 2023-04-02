import { textToAscii, asciiToText } from '../extras/Converters.js';
import { world } from '@minecraft/server';
import Server from './Server.js';
/*
 * Database system!
 * Main Developer: Mo9ses
 * Link to name: Database
*/
//CREDITS TO Mo9ses
const memory = {};
export class Database {
    constructor(table, identifier) {
        const id = identifier || 'DB';
        if ((id + table).length > 16)
            throw Error('[Database] constructor(): Error - The table name is too long!');
        try {
            world.scoreboard.addObjective(id + table, '');
        }
        catch (_a) { }
        ;
        this.fullName = id + table;
        this.table = table;
        Object.assign(memory, { [this.fullName]: {} });
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save
     * @param {boolean} memoryKey You can save the key and call for it later using .getCollection();
     * @returns {database}
     * @example .write('Test Key', 'Test Value');
     */
    write(key, value) {
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getTime()] });
        let keyL = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key) && p.score != 0).length + 1, j = 1, data = textToAscii(JSON.stringify(value));
        for (let l = 1; l < keyL; l++)
            Server.commandQueue(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        for (const hex of data)
            Server.commandQueue(`scoreboard players set "${key + j}" "${this.fullName}" ${hex}`), j++;
        Server.commandQueue(`scoreboard players set "${key}" "${this.fullName}" 0`);
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @returns {any}
     * @example .get('Test Key');
     */
    read(key) {
        var _a;
        if ((_a = memory[this.fullName][key]) === null || _a === void 0 ? void 0 : _a[1])
            return memory[this.fullName][key][0];
        const scores = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key) && p.score != 0).map(s => [parseInt(s.participant.displayName.replace(key, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
        if (!scores.length)
            return;
        const parts = JSON.parse(asciiToText(scores));
        Object.assign(memory[this.fullName], { [key]: [parts, new Date().getTime()] });
        return parts;
    }
    /**
     * Check if the key exists in the table
     * @param {string} key
     * @returns {boolean}
     * @example .has('Test Key');
     */
    has(key) {
        return Boolean(this.read(key));
    }
    /**
     * Delete the key from the table
     * @param {string} key
     * @returns {database}
     * @example .delete('Test Key');
     */
    delete(key) {
        delete memory[this.fullName][key];
        let length = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key)).length + 1;
        for (let l = 1; l < length; l++)
            Server.commandQueue(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        Server.commandQueue(`scoreboard players reset "${key}" "${this.fullName}"`);
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @returns {database}
     * @example .clear();
     */
    clear() {
        world.scoreboard.removeObjective(this.fullName);
        world.scoreboard.addObjective(this.fullName, '');
        return this;
    }
    /**
     * Drops the database
     * @returns {void} returns nothing
     * @example .drop();
     */
    drop() {
        world.scoreboard.removeObjective(this.fullName);
    }
    /**
     * Gets all the  keys in the table
     * @returns {string[]} A array with all the keys
     * @example .allKeys();
     */
    allKeys() {
        return world.scoreboard.getObjective(this.fullName).getScores().filter(s => s.score === 0).map(n => n.participant.displayName);
    }
    /**
     * Gets all the of keys in the table then gets their value
     * @returns {string[]} A array with all the values
     * @example .allValues();
     */
    allValues() {
        const allKeys = this.allKeys();
        if (!allKeys)
            return;
        return allKeys.map(key => this.read(key));
    }
    /**
     * Gets every key along their corresponding value in the Database
     * @returns {object} { [key]: value }
     * @example .getCollection();
     */
    getCollection() {
        const allKeys = this.allKeys(), collection = {};
        if (!allKeys)
            return;
        allKeys.forEach((key) => Object.assign(collection, { [key]: this.read(key) }));
        return collection;
    }
    /**
     * Runs a forEach loop on every key in the database
     * @param callback The function you want to run on the keys
     * @returns {database}
     * @example .forEach((key, value) => console.warn(key));
     */
    forEach(callback) {
        const collection = this.getCollection();
        try {
            Object.keys(collection).forEach(key => callback(key, collection[key]));
        }
        catch (e) {
            console.warn(e + e.stack);
        }
        return this;
    }
    /**
     * Re-maps every key in the database
     * @param callback The function you want to run on the keys
     * @returns {database}
     * @example .forEach((key, value) => { key, value + 1 });
     */
    map(callback) {
        const then = this.getCollection(), now = [];
        try {
            Object.keys(then).forEach(key => now.push(callback(key, then[key]) || undefined));
        }
        catch (e) {
            console.warn(e + e.stack);
        }
        now.forEach((v, i) => {
            if (!v.length)
                return;
            const oldKey = Object.keys(then)[i];
            if (v[0] != oldKey) {
                this.delete(oldKey);
                return this.write(v[0], v[1]);
            }
            return this.write(oldKey, v[1]);
        });
        return this;
    }
}
