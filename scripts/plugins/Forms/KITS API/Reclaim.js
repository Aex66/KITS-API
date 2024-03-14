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
© Copyright 2023 all rights reserved. Do NOT steal, copy the code, or claim it as yours.
Thank you
*/
import { EquipmentSlot, world } from "@minecraft/server";
import { EconomyObjective } from "../../../config.js";
import { MS } from "../../../extras/Converters.js";
import { translate } from "../../../extras/Lang.js";
import { newItem, removeAllCooldownTags } from "../../../extras/Utils.js";
import { Script, KitsApiEvents } from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { ActionFormData } from "@minecraft/server-ui";
import { kits } from "./Kits.js";
export const _claim = (player, kit, status) => {
    const ReclaimForm = new ActionFormData()
        .title(kit.name)
        .body(status ? status : 'api.kits.reclaim.components.default')
        .button('api.kits.reclaim.components.confirm.text', 'textures/emojis/CHECK.png')
        .button('api.kits.reclaim.components.return.text', 'textures/emojis/RETURN.png');
    ReclaimForm.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player);
        const pressedButton = res.selection;
        switch (pressedButton) {
            case 0:
                const ms = Date.now();
                const KitData = kit;
                const isAdmin = player.hasTag(Script.adminTag);
                const items = KitData.items;
                //@ts-ignore
                const inventory = player.getComponent('inventory').container;
                //@ts-ignore
                const equipment = player.getComponent('equippable');
                if (!isAdmin && (KitData.tag && !player.hasTag(KitData.tag)))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.noperms' });
                const cooldown = Number(player.getDynamicProperty(`KitCooldown:${kit.name}`)) ?? null;
                if (!isAdmin && (cooldown && cooldown > Date.now()))
                    return player.sendMessage(translate('inCooldown', [MS(cooldown - Date.now())]));
                if (!isAdmin && (KitData.once && player.getDynamicProperty(`ClaimedKit:${kit.name}`)))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.onlyonce' });
                if (inventory.emptySlotsCount < KitData.itemCount)
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                let money = 0;
                try {
                    money = world.scoreboard.getObjective(EconomyObjective).getScore(player.scoreboardIdentity);
                }
                catch { }
                if (!isAdmin && (KitData?.price && KitData?.price > 0 && money < KitData?.price))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.notenoughmoney' });
                if (!isAdmin && (KitData?.price && KitData?.price > 0 && money >= KitData?.price))
                    player.runCommandAsync(`scoreboard players remove @s ${EconomyObjective} ${KitData.price}`);
                //Offhand check
                if (KitData.offhand && equipment.getEquipment(EquipmentSlot.Offhand))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                const armor = KitData.armor;
                //Armor check
                if (armor.helmet && equipment.getEquipment(EquipmentSlot.Head))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                if (armor.chest && equipment.getEquipment(EquipmentSlot.Chest))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                if (armor.legs && equipment.getEquipment(EquipmentSlot.Legs))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                if (armor.feet && equipment.getEquipment(EquipmentSlot.Feet))
                    return player.sendMessage({ translate: 'api.kits.errors.reclaim.insufficientslots' });
                if (KitData.offhand)
                    equipment.setEquipment(EquipmentSlot.Offhand, newItem(KitData.offhand));
                if (armor.helmet)
                    equipment.setEquipment(EquipmentSlot.Head, newItem(armor.helmet));
                if (armor.chest)
                    equipment.setEquipment(EquipmentSlot.Chest, newItem(armor.chest));
                if (armor.legs)
                    equipment.setEquipment(EquipmentSlot.Legs, newItem(armor.legs));
                if (armor.feet)
                    equipment.setEquipment(EquipmentSlot.Feet, newItem(armor.feet));
                for (const item of items) {
                    inventory.addItem(newItem(item));
                }
                if (!isAdmin && KitData?.price > 0) {
                    FormKit(player, translate('purchasedKitSucces', [kit.name]));
                    /**
                     * Emit purchase event
                     */
                    KitsApiEvents.emit('purchase', {
                        name: kit.name,
                        price: KitData.price,
                        player: player,
                        executionTime: Date.now() - ms + 'ms'
                    });
                    if (KitData.once)
                        player.setDynamicProperty(`ClaimedKit:${kit.name}`, true);
                    removeAllCooldownTags(player, kit.name);
                    if (KitData.cooldown > 0)
                        player.setDynamicProperty(`KitCooldown:${kit.name}`, Date.now() + KitData.cooldown);
                    return;
                }
                FormKit(player, translate('reclaimSucces', [kit.name]));
                /**
                 * Emit claim event
                 */
                KitsApiEvents.emit('claim', {
                    name: kit.name,
                    player: player,
                    executionTime: Date.now() - ms + 'ms'
                });
                if (!isAdmin) {
                    if (KitData.once)
                        player.setDynamicProperty(`ClaimedKit:${kit.name}`, true);
                    removeAllCooldownTags(player, kit.name);
                    if (KitData.cooldown > 0)
                        player.setDynamicProperty(`KitCooldown:${kit.name}`, Date.now() + KitData.cooldown);
                }
                break;
            case 1:
                kits(player);
                break;
        }
    });
};
