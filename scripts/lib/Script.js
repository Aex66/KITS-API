import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";
class ScriptConstructor extends EventEmitter {
    constructor() {
        super(...arguments);
        this.kits = new Database('KITS');
        this.prefix = 'ka?';
        this.adminTag = 'Admin';
    }
}
const Script = new ScriptConstructor();
export default Script;
