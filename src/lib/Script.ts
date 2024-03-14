import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";

class ScriptConstructor {
    public kits: Database = new Database('KITS')
    public prefix: string = 'ka?'
    public adminTag: string = 'Admin'
}

class Events extends EventEmitter {

}
const KitsApiEvents = new Events()
const Script = new ScriptConstructor()
export {
    Script,
    KitsApiEvents
}