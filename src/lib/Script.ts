import { world } from "@minecraft/server";
import Database from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";

class ScriptConstructor {
    public kits: database
    public prefix: string = 'ka?'
    public adminTag: string = 'Admin'

    async init() {
        this.kits = await Database.register('KITS')
    }
}

class Events extends EventEmitter {

}
const KitsApiEvents = new Events()
const Script = new ScriptConstructor()

world.afterEvents.worldInitialize.subscribe(async () => {
    await Script.init()
})
export {
    Script,
    KitsApiEvents
}