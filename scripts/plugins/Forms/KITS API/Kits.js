import { FormKit } from "./FormKit.js";
import { Script } from "../../../lib/Script.js";
import { ChestGui } from "../../../lib/ChestGui.js";
import { MS } from "../../../extras/Converters.js";
import { ActionFormData } from "@minecraft/server-ui";
import { _delete } from "./Delete.js";
import { _edit } from "./Edit.js";
import { _view } from "./View.js";
import { _claim } from "./Reclaim.js";
export const kits = (player) => {
    const Kits = Script.kits.allValues();
    if (Kits.length < 1)
        return player.sendMessage(`§cThere are no kits in this server`);
    const form = new ChestGui();
    form.setType('54');
    form.title('Reclaim');
    Kits.forEach(kit => {
        const lore = [
            kit?.description ?? 'No description',
            ``,
            `§cDetails:`,
            `§7Once: §e${kit.once}`,
            `§7Tag: §e${kit.tag}`,
            `§7Cooldown: §e${MS(kit.cooldown)}`,
            ``,
            `${player.hasTag(Script.adminTag) ? `§7Click to see options` : `§7Click to claim`}`,
            ``,
            `§aCreated at ${kit.createdAt}`
        ];
        form.item(kit?.slot ?? ~~(Math.random() * 54), `§d${kit.name}`, lore, kit?.image ? kit.image : 'minecraft:standing_banner', 1, false, []);
    });
    form.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player);
        const selected = Kits.find(kit => kit.slot === res.selection);
        if (!selected)
            return;
        if (player.hasTag(Script.adminTag)) {
            const question = new ActionFormData();
            question.title(`§7KIT OPTIONS`);
            question.title(`§l§7SELECT AN OPTION`);
            question.button(`§l§eCLAIM KIT`);
            question.button(`§l§dDELETE KIT`);
            question.button(`§l§bVIEW KIT`);
            question.button(`§l§cEDIT KIT`);
            question.show(player).then(answer => {
                if (answer.canceled)
                    return kits(player);
                switch (answer.selection) {
                    case 0:
                        _claim(player, selected);
                        break;
                    case 1:
                        _delete(player, selected);
                        break;
                    case 2:
                        _view(player, selected);
                        break;
                    case 3:
                        _edit(player, selected);
                        break;
                }
            });
            return;
        }
        return _claim(player, selected);
    });
};
