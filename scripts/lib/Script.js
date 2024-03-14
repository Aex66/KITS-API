import { world } from "@minecraft/server";
import Database from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";
class ScriptConstructor {
    kits;
    prefix = 'ka?';
    adminTag = 'Admin';
    async init() {
        this.kits = await Database.register('KITS');
    }
}
class Events extends EventEmitter {
}
const KitsApiEvents = new Events();
const Script = new ScriptConstructor();
world.afterEvents.worldInitialize.subscribe(async () => {
    await Script.init();
});
export { Script, KitsApiEvents };
