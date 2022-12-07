import { textToHex, hexToText } from '../extras/Converters.js';
import { world } from '@minecraft/server';
import Server from './Server.js';
/*
 * Database system!
 * Main Developer: Mo9ses
 * Link to name: Database
*/
//CREDITS TO Mo9ses
const memory: { [key: string]: { [key: string]: any }} = {};
export class Database {
    readonly table: string;
    readonly fullName: string;
    constructor(table: string, identifier?: string) {
        const id = identifier || 'DB';
        if((id + table).length > 16) throw Error('[Database] constructor(): Error - The table name is too long!');
        try { world.scoreboard.addObjective(id + table, ''); } catch {};
        this.fullName = id + table;
        this.table = table;
        Object.assign(memory, { [this.fullName]: { } });
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save
     * @param {boolean} memoryKey You can save the key and call for it later using .getCollection();
     * @returns {database}
     * @example .write('Test Key', 'Test Value');
     */
    write(key: string, value: any): this {
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getTime()] });
        let keyL = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key)  && p.score != 0).length + 1, j = 1, data = textToHex(JSON.stringify(value));
        for(let l = 1; l < keyL; l++) Server.commandQueue(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        for(const hex of data) Server.commandQueue(`scoreboard players set "${key + j}" "${this.fullName}" ${hex}`), j++;
        Server.commandQueue(`scoreboard players set "${key}" "${this.fullName}" 0`);
        return this;
    } 
    /**
     * Get the value of the key
     * @param {string} key
     * @returns {any}
     * @example .get('Test Key');
     */
    read(key: string): any {
        if(memory[this.fullName][key]?.[1]) return memory[this.fullName][key][0];
        const scores = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key) && p.score != 0).map(s => [parseInt(s.participant.displayName.replace(key, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
        if(!scores.length) return;
        const parts = JSON.parse(hexToText(scores));
        Object.assign(memory[this.fullName], { [key]: [parts, new Date().getTime()] });
        return parts;
    }
    /**
     * Check if the key exists in the table
     * @param {string} key
     * @returns {boolean}
     * @example .has('Test Key');
     */
    has(key: string): boolean {
        return Boolean(this.read(key));
    }
    /**
     * Delete the key from the table
     * @param {string} key
     * @returns {database}
     * @example .delete('Test Key');
     */
    delete(key: string): this {
        delete memory[this.fullName][key];
        let length = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key)).length + 1;
        for(let l = 1; l < length; l++) Server.commandQueue(`scoreboard players reset "${key + l}" "${this.fullName}"`);
        Server.commandQueue(`scoreboard players reset "${key}" "${this.fullName}"`);
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @returns {database}
     * @example .clear();
     */
    clear(): this {
        world.scoreboard.removeObjective(this.fullName);
        world.scoreboard.addObjective(this.fullName, '');
        return this;
    }
    /**
     * Drops the database
     * @returns {void} returns nothing
     * @example .drop();
     */
    drop(): void {
        world.scoreboard.removeObjective(this.fullName);
    }
    /**
     * Gets all the  keys in the table
     * @returns {string[]} A array with all the keys
     * @example .allKeys();
     */
    allKeys(): string[] {
        return world.scoreboard.getObjective(this.fullName).getScores().filter(s => s.score === 0).map(n => n.participant.displayName);
    }
    /**
     * Gets all the of keys in the table then gets their value
     * @returns {string[]} A array with all the values
     * @example .allValues();
     */
    allValues(): any[] {
        const allKeys = this.allKeys();
        if(!allKeys) return;
        return allKeys.map(key => this.read(key));
    }
    /**
     * Gets every key along their corresponding value in the Database
     * @returns {object} { [key]: value } 
     * @example .getCollection();
     */
    getCollection(): { [key: string]: any } {
        const allKeys = this.allKeys(), collection = {};
        if(!allKeys) return;
        allKeys.forEach((key: any) => Object.assign(collection, { [key]: this.read(key) }));
        return collection;
    }
    /**
     * Runs a forEach loop on every key in the database
     * @param callback The function you want to run on the keys
     * @returns {database}
     * @example .forEach((key, value) => console.warn(key));
     */
    forEach(callback: (key: string, value: any) => void): this {
        const collection = this.getCollection();
        try {
            Object.keys(collection).forEach(key => callback(key, collection[key]));
        } catch(e) {
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
    map(callback: (key: string, value: any) => [key: string, value: any] | void): this {
        const then = this.getCollection(), now: ([string, any] | undefined)[] = [];
        try {
            Object.keys(then).forEach(key => now.push(callback(key, then[key]) || undefined));
        } catch(e) {
            console.warn(e + e.stack);
        }
        now.forEach((v, i) => {
            if(!v.length) return;
            const oldKey = Object.keys(then)[i];
            if(v[0] != oldKey) {
                this.delete(oldKey);
                return this.write(v[0], v[1]);
            }
            return this.write(oldKey, v[1]);
        });
        return this;
    }
}