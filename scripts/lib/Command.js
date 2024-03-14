import { system } from "@minecraft/server";
import { world } from "@minecraft/server";
import { Script } from "./Script";
const commandPrefix = Script.prefix;
export const adminTag = Script.adminTag;
export class Command {
    static rC = [];
    /**
     * Register a new command!
     * @param {ICommandInfo} info Register info for the command
     * @param {(player: Player, args: string[], executionTime: string) => void} callback Function to execute when the command is ran
     * @example new Command({
     * name: 'test',
     * admin: true,
     * aliases: ['test1','test2']
     * }, player => {
     * console.warn(player.name)
     * })
     */
    constructor(info, callback) {
        Command.rC.push({
            name: info.name.toLowerCase(),
            description: info?.description ?? undefined,
            aliases: info?.aliases ? info.aliases.map(alias => alias.toLowerCase()) : undefined,
            admin: info?.admin ?? undefined,
            callback
        });
    }
    /**
     * Get command data
     * @param {string} cmdString
     * @returns {}
     */
    static getCommand(cmdString) {
        return Command.rC.find(cmd => cmd.name === cmdString || cmd?.aliases?.includes(cmdString)) ?? undefined;
    }
    /**
     * Get all stored commands
     * @returns {}
     */
    static getCommands() {
        return Command.rC;
    }
    /**
     * Test if a command exist
     * @param {string} cmdString
     * @returns {boolean}
     */
    static exist(cmdString) {
        return Command.rC.some(cmd => cmd.name === cmdString || cmd.aliases?.includes(cmdString));
    }
    /**
     * Get command arguments
     * @param {string} message
     * @returns {Array<string>}
     */
    static getArgs(message) {
        return message.slice(commandPrefix.length).trim().split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/g)
            .map(arg => arg.replaceAll("\\", "").replaceAll("\"", ""));
    }
    static getAdminTag() {
        return adminTag;
    }
    static getPrefix() {
        return commandPrefix;
    }
}
world.beforeEvents.chatSend.subscribe(data => {
    const sender = [data.sender].flat()[0], message = [data.message].flat()[0];
    if (data.message.startsWith(commandPrefix)) {
        data.cancel = true;
        const now = Date.now();
        const args = Command.getArgs(message);
        const cM = args.shift();
        const cD = Command.getCommand(cM);
        if (!cD)
            return sender.sendMessage(`§cThe command §e${cM} §cdoes not exist.`);
        if (cD.admin && !sender.hasTag(adminTag))
            return sender.sendMessage(`§cYou do not have permission to run that command!`);
        try {
            system.run(() => cD.callback(sender, args, `${Date.now() - now}ms`));
        }
        catch (error) {
            console.warn(`§cAN ERROR OCURRED WHILE TRYING TO EXECUTE COMMAND CALLBACK AT:\n` + error, error.stack);
        }
    }
});
