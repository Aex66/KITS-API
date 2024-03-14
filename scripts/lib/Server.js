import { world } from "@minecraft/server";
import { setTickInterval } from "../extras/Scheduling.js";
/*
 * Command queue system
*/
const commandQueue = [];
setTickInterval(() => {
    if (!commandQueue.length)
        return;
    const hundred = commandQueue.slice(0, 100);
    commandQueue.splice(0, 100);
    for (let i = 0; i < 100; i++) {
        if (!hundred[i])
            return;
        world.getDimension(hundred[i][1] ?? 'overworld').runCommandAsync(hundred[i][0]).catch();
    }
}, 5);
class ServerBook {
    /**
    * Push commands to the command queue
    * @param command The command you want to run
    * @param dimension The dimension you want the command run
    * @returns {string} command had error
    * @example .commandQueue('say Hello World!');
    */
    commandQueue(command, dimension) {
        commandQueue.push(dimension ? [command, dimension] : [command]);
    }
    /**
    * Run a asynchronous command in game that will run at runtime
    * @param command The command you want to run
    * @param dimension The dimension you want the command run
    * @returns {string} command had error
    * @example .runAsyncCMD('say Hello World!');
    */
    async runCommand(command, dimension) {
        let value = '';
        await world.getDimension(dimension ?? 'overworld').runCommandAsync(command).catch(e => value = e);
        return value;
    }
    /**
    * Run an array of commands
    * @param {Array<string>} commands Put '%' before your commands. It will make it so it only executes if all the commands thta came before it executed successfully!
    * @returns {{error: boolean }}
    * @example .runCommands([
    *   'clear "notbeer" diamond 0 0',
    *   '%say notbeer has a Diamond!'
    * ]);
    */
    runCommands(commands) {
        const conditionalRegex = /^%/;
        if (conditionalRegex.test(commands[0]))
            throw '§l§c>>§r§4: runCommands(): Error - First command in the Array CANNOT be Conditional';
        let e = false;
        commands.forEach(async (cmd) => {
            if (e && conditionalRegex.test(cmd))
                return;
            e = Boolean(await this.runCommand(cmd.replace(conditionalRegex, '')));
        });
        return { error: e };
    }
}
const Server = new ServerBook();
export default Server;
