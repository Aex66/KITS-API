/*
Developers:
Aex66:
Discord: Aex66#0202
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
           _____
          /  _  \   ____ ___  ___
         /  /_\  \_/ __ \\  \/  /
        /    |    \  ___/ >    <
        \____|__  /\___  >__/\_ \
                \/     \/      \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved. Do NOT steal, copy the code, or claim it as yours.
Thank you
*/
import { world } from "@minecraft/server";
import { EconomyObjective } from "../../../config.js";
import { MS } from "../../../extras/Converters.js";
import { translate } from "../../../extras/Lang.js";
import { newItem, removeAllCooldownTags } from "../../../extras/Utils.js";
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { ReclaimSelect } from "./ReclaimSelect.js";
import { ActionFormData } from "@minecraft/server-ui";
export const Reclaim = (player, kitName, status) => {
    const { description } = Script.kits.read(kitName);
    const ReclaimForm = new ActionFormData()
        .title(kitName)
        .body(status ? status : 'api.kits.reclaim.components.default')
        .button('api.kits.reclaim.components.confirm.text', 'textures/emojis/CHECK.png')
        .button('api.kits.reclaim.components.return.text', 'textures/emojis/RETURN.png');
    ReclaimForm.show(player).then((res) => {
        var _a, _b;
        if (res.canceled)
            return FormKit(player);
        const pressedButton = res.selection;
        switch (pressedButton) {
            case 0:
                const ms = Date.now();
                const KitData = Script.kits.read(kitName);
                const isAdmin = player.hasTag(Script.adminTag);
                const items = KitData.items;
                console.warn(JSON.stringify(KitData));
                const inventory = player.getComponent('inventory').container;
                if (!isAdmin && (KitData.requiredTag && KitData.requiredTag !== 'noReqTag' && !player.hasTag(KitData.requiredTag)))
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.noperms');
                const cooldown = (_b = Number((_a = player.getTags().find((tag) => tag.startsWith(`KA-Cooldown:${kitName}:`))) === null || _a === void 0 ? void 0 : _a.substring(12 + kitName.length + 1))) !== null && _b !== void 0 ? _b : null;
                if (!isAdmin && (cooldown && cooldown > Date.now()))
                    return ReclaimSelect(player, translate('inCooldown', [MS(cooldown - Date.now())]));
                if (!isAdmin)
                    removeAllCooldownTags(player, kitName),
                        player.addTag(`KA-Cooldown:${kitName}:${Date.now() + KitData.cooldown}`);
                if (!isAdmin && (KitData.onlyOnce && player.hasTag(`KA-ClaimedKit:${kitName}`)))
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.onlyonce');
                if (KitData.onlyOnce)
                    player.addTag(`KA-ClaimedKit:${kitName}`);
                if (inventory.emptySlotsCount < KitData.itemCount)
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.insufficientslots');
                let money = 0;
                try {
                    money = world.scoreboard.getObjective(EconomyObjective).getScore(player.scoreboard);
                }
                catch (_c) { }
                if (!isAdmin && ((KitData === null || KitData === void 0 ? void 0 : KitData.price) && (KitData === null || KitData === void 0 ? void 0 : KitData.price) > 0 && money < (KitData === null || KitData === void 0 ? void 0 : KitData.price)))
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.notenoughmoney');
                if (!isAdmin && ((KitData === null || KitData === void 0 ? void 0 : KitData.price) && (KitData === null || KitData === void 0 ? void 0 : KitData.price) > 0 && money >= (KitData === null || KitData === void 0 ? void 0 : KitData.price)))
                    player.runCommandAsync(`scoreboard players remove @s ${EconomyObjective} ${KitData.price}`);
                for (const item of items) {
                    inventory.addItem(newItem(item));
                }
                if (!isAdmin && (KitData === null || KitData === void 0 ? void 0 : KitData.price) > 0) {
                    FormKit(player, translate('purchasedKitSucces', [kitName]));
                    return Script.emit('kitPurchased', {
                        kitName,
                        price: KitData.price,
                        player: player,
                        executionTime: Date.now() - ms + 'ms'
                    });
                }
                FormKit(player, translate('reclaimSucces', [kitName]));
                Script.emit('kitClaimed', {
                    kitName,
                    player: player,
                    executionTime: Date.now() - ms + 'ms'
                });
                break;
            case 1:
                ReclaimSelect(player);
                break;
        }
    });
};
