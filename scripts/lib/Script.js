import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";
class ScriptConstructor {
    kits = new Database('KITS');
    prefix = 'ka?';
    adminTag = 'Admin';
}
class Events extends EventEmitter {
}
const KitsApiEvents = new Events();
const Script = new ScriptConstructor();
export { Script, KitsApiEvents };
