declare class registry {
    readonly file: string
    /**
     * Creating a objective
     * @param file The file
     */
    constructor(file: string)
    /**
     * Save a value or update a value in the registry under a key
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .write('Test Key', 1);
     * @returns {this}
     */
    write(key: string | number, value: number): this
    /**
     * Save value(s) or update value(s) in the registry under key(s)
     * @param {{ [key: string]: number }} data data?
     * @example .writeMany({ 'bro': 1, nice1: 25 });
     * @returns {this}
     */
    writeMany(data: { [key: string | number]: number}): this
    /**
     * Add or subtract a number to a key's value
     * @param {string} key The key you want to save the value as
     * @param {number} value The number value you want to save
     * @example .shaft('Test Key', 1);
     * @returns {this}
     */
    shift(key: string | number, value?: number): this
    /**
     * Get the value of the key
     * @param {string} key
     * @example .read('Test Key');
     * @returns {string | number}
     */
    read<T, K extends (T extends true ? string : number)>(key: string | number, stringify?: T): K
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @example .readMany(['Test Key', 'Sweater Weather']);
     * @returns {any[]}
     */
    readMany(keys: (string | number)[]): number[]
    /**
     * Check if the key exists in the file
     * @param {string} key
     * @example .has('Test Key');
     * @returns {boolean}
     */
    has(key: string | number): boolean
    /**
     * Delete a key from the table
     * @param {string} key
     * @example .delete('Test Key');
     * @returns {this}
     */
    delete(key: string): this
    /**
     * Delete the key from the table
     * @param {string[]} keys
     * @returns {database}
     * @example .deleteMany('Test Key');
     */
    deleteMany(keys: string[]): this
    /**
     * Deletes every key along their corresponding value in the registry file
     * @example .clear();
     * @returns {this}
     */
    clear(): this
    /**
     * Gets all the keys in the registry
     * @example .allKeys();
     * @returns {string[]} A array with all the keys
     */
    allKeys(): string[]
    /**
     * Gets all the of values for each key in the registry
     * @example .allValues();
     * @returns {number[]} A array with all the values
     */
    allValues(): number[]
    /**
     * Find a the first key assigned to said value
     * @param {number} value The number value 
     * @example .find(893724);
     * @returns {string | number} The key
     */
    find(value: number): string
    /**
     * Find any key assigned to said value
     * @param {number} value The number value
     * @example .find(897232);
     * @returns {string[]} The keys
     */
    findMany(value: number): string[]
    /**
     * Gets every key along their corresponding number value in the registry
     * @example .getCollection();
     * @returns {{ [key: string | number]: number }}
     */
    getCollection(): { [key: string]: number }
}
declare class database {
    readonly table: string
    readonly fullName: string
    /**
     * Creating a database!
     * @param table The name of the table
     * @param identifier The id of the table. Used like this "id:table"
     */
    constructor(table: string, identifier?: string)
    /**
     * Save a value or update a value in the Database under a key
     * @param {string} key The key you want to save the value as
     * @param {any} value The value you want to save
     * @param {boolean} memoryKey You can save the key and call for it later using .getCollection();
     * @returns {database}
     * @example .write('Test Key', 'Test Value');
     */
    write(key: string, value: any): this
    /**
     * Save value(s) or update value(s) in the Database under key(s)
     * @param {{ [key: string]: any }} data data?
     * @returns {database}
     * @example .write('Test Key', 'Test Value');
     */
    writeMany(data: { [key: string]: any }): this
    /**
     * Get the value of the key
     * @param {string} key
     * @returns {any}
     * @example .get('Test Key');
     */
    read(key: string): any
    /**
     * Get the value of many keys
     * @param {string[]} keys
     * @returns {any[]}
     * @example .readMany('Test Key');
     */
    readMany(keys: string[]): any[]
    /**
     * Check if the key exists in the table
     * @param {string} key
     * @returns {boolean}
     * @example .has('Test Key');
     */
    has(key: string): boolean
    /**
     * Delete the key from the table
     * @param {string} key
     * @returns {database}
     * @example .delete('Test Key');
     */
    delete(key: string): this
    /**
     * Deletes every key along their corresponding value in the Database
     * @returns {database}
     * @example .clear();
     */
    clear(): this
    /**
     * Gets all the  keys in the table
     * @returns {string[]} A array with all the keys
     * @example .allKeys();
     */
    allKeys(): string[]
    /**
     * Gets all the of keys in the table then gets their value
     * @returns {string[]} A array with all the values
     * @example .allValues();
     */
    allValues(): any[]
    /**
     * Gets every key along their corresponding value in the Database
     * @returns {object} { [key]: value } 
     * @example .getCollection();
     */
    getCollection(): { [key: string]: any }
    /**
     * Runs a forEach loop on every key in the database
     * @param callback The function you want to run on the keys
     * @returns {database}
     * @example .forEach((key, value) => console.warn(key));
     */
    forEach(callback: (key: string, value: any) => void): this
    /**
     * Re-maps every key in the database
     * @param callback The function you want to run on the keys
     * @returns {database}
     * @example .forEach((key, value) => { key, value + 1 });
     */
    map(callback: (key: string, value: any) => [key: string, value: any] | void): this
}