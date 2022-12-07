import { Player } from "@minecraft/server"
interface ICommandInfo {
    /**
     * The name of the command
     * @example ```"mute"```
     */
    name: string;
    /**
     * A short description of how this command works
     * @example ```"Mute a player"```
     */
    description: string;
    /**
     * Other names that can call this command
     * @example ```['m', 'mut']```
     */
    aliases: string[];
    /**
     * Determine if you need to be an administrator to be able to use this command
     * @example ```true```
     */
    admin: boolean;
    /**
     * Function to execute when the command is ran
     *@example ```js
     *.callback(player, args) => console.warn(player.name, JSON.stringify(args))
     *```
    */
    callback?: (player?: Player, args?: string[], executionTime?: string) => void
}