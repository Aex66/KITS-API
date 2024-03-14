import { world } from "@minecraft/server";
import { KitsApiEvents } from "./lib/Script";
/**
 * KITS API EVENTS
 */
KitsApiEvents.on('create', (res) => {
    const { player, data } = res;
    world.sendMessage(`§a${player.name} created the kit §b${data.name}`);
});
KitsApiEvents.on('delete', (res) => {
    const { player, data } = res;
    world.sendMessage(`§a${player.name} deleted the kit §b${data.name}`);
});
KitsApiEvents.on('claim', (res) => {
    const { player, name } = res;
    world.sendMessage(`§a${player.name} claimed the kit §b${name}`);
});
KitsApiEvents.on('purchase', (res) => {
    const { player, name } = res;
    world.sendMessage(`§a${player.name} bought the kit §b${name}`);
});
KitsApiEvents.on('edit', (res) => {
    const { player, newData } = res;
    world.sendMessage(`§a${player.name} edited the kit §b${newData.name}`);
});
