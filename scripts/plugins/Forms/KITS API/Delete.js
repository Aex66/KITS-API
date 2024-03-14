import { KitsApiEvents, Script } from "../../../lib/Script.js";
import { ActionFormData } from "@minecraft/server-ui";
import { kits } from "./Kits.js";
export const _delete = (player, kit) => {
    const Kits = Script.kits.allKeys() ?? [];
    const KitNames = [];
    Kits?.forEach(kit => KitNames.push(kit));
    if (KitNames.length < 1)
        KitNames.push('none');
    new ActionFormData()
        .title(`Delete ${kit.name}`)
        .body(`§7Are you sure you want to delete this kit?`)
        .button(`§l§aCONFIRM`)
        .button(`§l§cCANCEL`)
        .show(player).then((res) => {
        if (res.canceled)
            return kits(player);
        const ms = Date.now();
        Script.kits.delete(kit.name);
        player.sendMessage(`§aSucces deleting kit §r§e${kit.name}`);
        KitsApiEvents.emit('delete', {
            player: player,
            data: kit,
            executionTime: Date.now() - ms + 'ms'
        });
    });
};
