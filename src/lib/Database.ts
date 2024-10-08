import { system, world } from '@minecraft/server';
import Server from './Server.js';
const release = 5 
/*
 * Database system!
 * Main Developer: Mo9ses
 * Link to name: Database
*/
//CREDITS TO Mo9ses

try { world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "DB:model" dummy`) } catch {};

class DatabasePaper {
    /**
     * Creates a raw scoreboard database that uses player names and number values
     * @param table The table
     * @returns {registry}
     */
    async registry(file: string): Promise<registry> {
        try { await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${file}" dummy`); } catch {}
        return new registry(file);
    }
    /**
     * This registers or creates a table inside a database. The database's name will be the identifier
     * @param table Table name for the database
     * @param identifier The database name
     * @returns {database}
     */
    async register(table: string, identifier?: string): Promise<database> {
        if(!identifier) identifier = '';
        if(identifier === 'DB') throw Error('You cannot create a database with the identifier "DB"');
        if(table === 'model') throw Error('You cannot create a database with the table "model"');
        if(table.includes(':') || identifier.includes(':')) throw Error(`The database "${table}" table name or identifier cannot include a ":"`);
        Server.queueCommand(`scoreboard players set "${identifier}" "DB:model" 0`);
        try {
            await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "DB:${identifier}" dummy`);
            await world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${identifier}:${table}" dummy`);
        } catch {};
        Server.queueCommand(`scoreboard players set "${table}" "DB:${identifier}" 0`);
        return new database(`${identifier}:`, table);
    }
    /**
     * Checks if the world has a database
     * @param table The name of the table
     * @param identifier The identifier
     * @returns {boolean}
     */
    has(table: string, identifier?: string): boolean {
        return Boolean(world.scoreboard.getObjective(`${identifier ?? ''}:${table}`)?.id);
    }
    /**
     * Drops a table
     * @returns {void} returns nothing
     * @example .drop('Bruh', 'MEMES');
     */
    drop(table: string, identifier?: string): void {
        if(!identifier) identifier = '';
        Server.queueCommand(`scoreboard players reset "${table}" "DB:${identifier}"`);
        try { world.scoreboard.removeObjective(`${identifier}:${table}`); } catch {};
        if(this.allTables(identifier).length === 1) {
            Server.queueCommand(`scoreboard players reset "${identifier}" "DB:model"`);
            try { world.scoreboard.removeObjective(`DB:${identifier}`); } catch {};
        }
        delete memory[`${identifier}:${table}`];
    }
    /**
     * List all of the registered tables
     * @param {string} identifier List all of the tables with a specific identifier
     * @returns {string[] | { id: string[] }}
     */
    allTables<T, K extends (T extends string ? string[] : { [id: string]: string[] })>(identifier?: T): K {
        if(identifier) {
            if(!world.scoreboard.getObjective(`DB:${identifier}`)) return [] as K;
            return world.scoreboard.getObjective(`DB:${identifier}`).getParticipants().map(p => p.displayName) as K;
        }
        const IDs = {};
        world.scoreboard.getObjective('DB:model').getParticipants().map(p => p.displayName).forEach(i => Object.assign(IDs, { [i]: world.scoreboard.getObjective(`DB:${i}`).getParticipants().map(p2 => p2.displayName)}));
        return IDs as K;
    }
}
const Database = new DatabasePaper();
export default Database;

const regMemory: { [file: string]: [{ [key: string]: number }, number] } = {};
class registry {
    readonly file: string
    /**
     * Creating a objective
     * @param file The file
     */
    constructor(file: string) {
        this.file = file;
        if(regMemory.hasOwnProperty(file)) return;
        Object.assign(regMemory, { [file]: [{}, new Date().getMinutes() + release] });
        for(const score of world.scoreboard.getObjective(file).getScores()) regMemory[file][0][score.participant.displayName] = score.score;
    }
    /**
     * Save a value or update a value in the registry under a key
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .write('Test Key', 1);
     * @returns {this}
     */
    write(key: string | number, value: number): this {
        regMemory[this.file][0][key] = value;
        Server.queueCommand(`scoreboard players set "${key}" "${this.file}" ${value}`);
        return this;
    }
    /**
     * Save value(s) or update value(s) in the registry under key(s)
     * @param {{ [key: string]: number }} data data?
     * @example .writeMany({ 'bro': 1, nice1: 25 });
     * @returns {this}
     */
    writeMany(data: { [key: string | number]: number}): this {
        Object.keys(data).forEach(key => {
            regMemory[this.file][0][key] = data[key];
            Server.queueCommand(`scoreboard players set "${key}" "${this.file}" ${data[key]}`);
        });
        return this;
    }
    /**
     * Add or subtract a number to a key's value
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .shift('Test Key', 1);
     * @returns {this}
     */
    shift(key: string | number, value?: number): this {
        //@ts-ignore
        regMemory[this.file][0][key] = regMemory[this.file][0][key] + value ?? 1;
        Server.queueCommand(`scoreboard players add "${key}" "${this.file}" ${value}`);
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @example .read('Test Key');
     * @returns {number}
     */
    read<T, K extends (T extends true ? string : number)>(key: string | number, stringify?: T): K {
        if(stringify) return (regMemory[this.file][0].hasOwnProperty(key) ? String(regMemory[this.file][0][key]) : undefined) as K
        return (regMemory[this.file][0][key]) as K;
    }
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @example .readMany(['Test Key', 'Sweater Weather']);
     * @returns {any[]}
     */
    readMany(keys: (string | number)[], stringify?: boolean): number[] {
        return keys.map(key => {
            if(stringify) regMemory[this.file][0].hasOwnProperty(key) ? String(regMemory[this.file][0][key]) : undefined
            return regMemory[this.file][0][key];
        });
    }
    /**
     * Check if the key exists in the file
     * @param {string} key
     * @example .has('Test Key');
     * @returns {boolean}
     */
    has(key: string | number): boolean {
        return regMemory[this.file][0].hasOwnProperty(key);
    }
    /**
     * Delete a key from the table
     * @param {string} key
     * @example .delete('Test Key');
     * @returns {this}
     */
    delete(key: string | number): this {
        delete regMemory[this.file][0][key];
        Server.queueCommand(`scoreboard players reset "${key}" "${this.file}"`);
        return this;
    }
    /**
     * Delete the key from the table
     * @param {string[]} keys
     * @returns {database}
     * @example .deleteMany('Test Key');
     */
    deleteMany(keys: string[]): this {
        for(const k of keys) {
            delete regMemory[this.file][0][k];
            Server.queueCommand(`scoreboard players reset "${k}" "${this.file}"`);
        }
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the registry file
     * @example .clear();
     * @returns {this}
     */
    clear(): this {
        delete regMemory[this.file];
        try { world.getDimension('overworld').runCommandAsync(`scoreboard objectives remove "${this.file}" dummy`) } catch {};
        try { world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${this.file}" dummy`) } catch {};
        return this;
    }
    /**
     * Gets all the keys in the registry
     * @example .allKeys();
     * @returns {string[]} A array with all the keys
     */
    allKeys(): string[] {
        return Object.keys(regMemory[this.file][0]);
    }
    /**
     * Gets all the of values for each key in the registry
     * @example .allValues();
     * @returns {number[]} A array with all the values
     */
    allValues(): number[] {
        return Object.values(regMemory[this.file][0]);
    }
    /**
     * Find a the first key assigned to said value
     * @param {number} value The number value
     * @example .find(893724);
     * @returns {string} The key
     */
    find(value: number): string {
        return Object.keys(regMemory[this.file][0]).find(k => regMemory[this.file][0][k] === value);
    }
    /**
     * Find any key assigned to said value
     * @param {number} value The number value
     * @example .find(897232);
     * @returns {string[]} The keys
     */
    findMany(value: number): string[] {
        return Object.keys(regMemory[this.file][0]).filter(k => regMemory[this.file][0][k] === value);
    }
    /**
     * Gets every key along their corresponding number value in the registry
     * @example .getCollection();
     * @returns {{ [key: string | number]: number }}
     */
    getCollection(): { [key: string]: number } {
        return regMemory[this.file][0];
    }
}

const memory: { [fullName: string]: { [key: string]: [any, number] } } = {};
class database {
    readonly table: string;
    readonly fullName: string;
    /**
     * Creating a database!
     * @param table The name of the table
     * @param identifier The database name. Used like this "id:table"
     */
    constructor(identifier: string, table: string) {
        this.table = table;
        this.fullName = `${identifier}${table}`;
        if(!memory.hasOwnProperty(this.fullName)) Object.assign(memory, { [this.fullName]: { } });
    }
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save. If you type null, it will not take any space
     * @example .write('Test Key', 'Test Value');
     * @returns {this}
     */
    write(key: string, value: any): this {
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getMinutes() + release] });
        let valueL = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key) && p.score !== 0).length + 1, j = 1;
        const data = textToAscii(JSON.stringify(value));
        if(valueL > data.length) for(let l = 1; l < valueL; l++) Server.queueCommand(`scoreboard players reset "${key}=${l}" "${this.fullName}"`);
        for(const hex of data) Server.queueCommand(`scoreboard players set "${key}=${j}" "${this.fullName}" ${hex}`), j++;
        Server.queueCommand(`scoreboard players set "${key}" "${this.fullName}" 0`);
        return this;
    }
    /**
     * Save value(s) or update value(s) in the Database under key(s)
     * @param {{ [key: string]: any }} data data?
     * @example .writeMany({ 'bro': 1, nice1: 'huh?' });
     * @returns {this}
     */
    writeMany(data: { [key: string]: any }): this {
        const scores = world.scoreboard.getObjective(this.fullName).getScores(), keys = Object.keys(data);
        for(const k of keys) {
            let j = 1;
            Object.assign(memory[this.fullName], { [k]: [data[k], new Date().getMinutes() + release] });
            const valueL = scores.filter(p => p.participant.displayName.startsWith(k) && p.score !== 0).length + 1, value = textToAscii(JSON.stringify(data[k]));
            if(valueL > value.length) for(let l = 1; l < valueL; l++) Server.queueCommand(`scoreboard players reset "${k}=${l}" "${this.fullName}"`);
            for(const hex of value) Server.queueCommand(`scoreboard players set "${k}=${j}" "${this.fullName}" ${hex}`), j++;
            Server.queueCommand(`scoreboard players set "${k}" "${this.fullName}" 0`);
        }
        return this;
    }
    /**
     * Get the value of the key
     * @param {string} key
     * @example .read('Test Key');
     * @returns {any}
     */
    read(key: string): any {
        if(memory[this.fullName].hasOwnProperty(key)) {
            memory[this.fullName][key][1] = new Date().getMinutes() + release;
            return memory[this.fullName][key][0];
        }
        const scores = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.replace(/=\d+/g, '') === key && p.score != 0).map(s => [Number(s.participant.displayName.replace(`${key}=`, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
        const value = scores.length ? JSON.parse(asciiToText(scores)) : undefined;
        Object.assign(memory[this.fullName], { [key]: [value, new Date().getTime()] });
        return value;
    }
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @example .readMany(['Test Key', 'Rod Wave']);
     * @returns {any[]}
     */
    readMany(keys: string[]): any[] {
        const scores = world.scoreboard.getObjective(this.fullName).getScores();
        return keys.map(k => {
            if(memory[this.fullName].hasOwnProperty(k)) {
                memory[this.fullName][k][1] = new Date().getMinutes() + release;
                return memory[this.fullName][k][0];
            }
            const score = scores.filter(p => p.participant.displayName.replace(/=\d+/g, '') === k && p.score != 0).map(s => [Number(s.participant.displayName.replace(`${k}=`, '')), s.score]).sort((a, b) => a[0] - b[0]).map(s => s[1]);
            const value = score.length ? JSON.parse(asciiToText(score)) : undefined;
            Object.assign(memory[this.fullName], { [k]: [value, new Date().getTime()] });
            return value;
        });
    }
    /**
     * Check if the key exists in the table
     * @param {string} key
     * @example .has('Test Key');
     * @returns {boolean}
     */
    has(key: string): boolean {
        if(memory[this.fullName].hasOwnProperty(key) && memory[this.fullName][key][0] !== undefined) return true;
        return world.scoreboard.getObjective(this.fullName)?.getScores().some(s => s.score === 0 && s.participant.displayName === key);
    }
    /**
     * Delete a key from the table
     * @param {string} key
     * @example .delete('Test Key');
     * @returns {this}
     */
    delete(key: string): this {
        delete memory[this.fullName][key];
        let length = world.scoreboard.getObjective(this.fullName).getScores().filter(p => p.participant.displayName.startsWith(key)).length + 1;
        for(let l = 1; l < length; l++) Server.queueCommand(`scoreboard players reset "${key}=${l}" "${this.fullName}"`);
        Server.queueCommand(`scoreboard players reset "${key}" "${this.fullName}"`);
        return this;
    }
    /**
     * Delete the key from the table
     * @param {string[]} keys
     * @returns {database}
     * @example .deleteMany('Test Key');
     */
    deleteMany(keys: string[]): this {
        const scores = world.scoreboard.getObjective(this.fullName).getScores();
        for(const k of keys) {
            delete memory[this.fullName][k];
            let length = scores.filter(p => p.participant.displayName.startsWith(k)).length + 1;
            for(let l = 1; l < length; l++) Server.queueCommand(`scoreboard players reset "${k}=${l}" "${this.fullName}"`);
            Server.queueCommand(`scoreboard players reset "${k}" "${this.fullName}"`);
        }
        return this;
    }
    /**
     * Deletes every key along their corresponding value in the Database
     * @example .clear();
     * @returns {database}
     */
    clear(): this {
        try { world.getDimension('overworld').runCommandAsync(`scoreboard objectives remove "${this.fullName}" dummy`) } catch {};
        try { world.getDimension('overworld').runCommandAsync(`scoreboard objectives add "${this.fullName}" dummy`) } catch {};
        return this;
    }
    /**
     * Gets all the  keys in the table
     * @example .allKeys();
     * @returns {string[]} A array with all the keys
     */
    allKeys(): string[] {
        return world.scoreboard.getObjective(this.fullName).getScores().filter(s => s.score === 0).map(n => n.participant.displayName);
    }
    /**
     * Gets all the of keys in the table then gets their value
     * @example .allValues();
     * @returns {string[]} A array with all the values
     */
    allValues(): any[] {
        const allKeys = this.allKeys();
        if(!allKeys?.length) return [];
        return this.readMany(allKeys);
    }
    /**
     * Gets every key along their corresponding value in the Database
     * @example .getCollection();
     * @returns {object} { [key]: value } 
     */
    getCollection(): { [key: string]: any } {
        const allKeys = this.allKeys(), allValues = this.readMany(allKeys), collection = {};
        allKeys.forEach((key: any, i: number) => Object.assign(collection, { [key]: allValues[i] }));
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

//Memory release system
system.runInterval(() => {
    if(system.currentTick < 50) return;
    const minute = new Date().getMinutes();
    Object.keys(memory).forEach(table => Object.keys(memory[table]).forEach(key => {
        if(memory[table][key][1] >= 5 && memory[table][key][1] > minute) return;
        delete memory[table][key];
    }));
}, 1200);

/**
* Convert string to hex
* @param {string} text 
* @returns {number[]}
*/// @ts-ignore
function textToAscii (text: string): number[] { return text.split('').map(char => char.charCodeAt()) }
/**
* Convert hex to string
* @param {number} hex 
* @returns {string}
*/
function asciiToText (hex: number[]): string { return hex.map(char => String.fromCharCode(char)).join('') }