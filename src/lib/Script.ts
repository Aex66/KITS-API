import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";

class ScriptConstructor extends EventEmitter {
    public kits: Database = new Database('KITS')
    public prefix: string = 'ka?'
    public adminTag: string = 'Admin'
}

const Script = new ScriptConstructor()
export default Script