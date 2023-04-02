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
import { Player, world } from "@minecraft/server";
import { EconomyObjective } from "../../../config.js";
import { MS } from "../../../extras/Converters.js";
import { translate } from "../../../extras/Lang.js";
import { newItem, removeAllCooldownTags } from "../../../extras/Utils.js";
import { KitInformation } from "../../../types";
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { ReclaimSelect } from "./ReclaimSelect.js";
import { ActionFormData } from "@minecraft/server-ui";
export const Reclaim = (player: Player, kitName: string, status?: string) => {

    const ReclaimForm = new ActionFormData()
    .title(kitName)
    .body(status ? status : 'api.kits.reclaim.components.default')
    .button(
        'api.kits.reclaim.components.confirm.text',
        'textures/emojis/CHECK.png'
    )
    .button(
        'api.kits.reclaim.components.return.text',
        'textures/emojis/RETURN.png'
    )

    ReclaimForm.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player)
        const pressedButton = res.selection
        switch (pressedButton) {
            case 0:
                const ms = Date.now()
                const KitData: KitInformation = Script.kits.read(kitName)
                const isAdmin = player.hasTag(Script.adminTag)
                const items = KitData.items

                //@ts-ignore
                const inventory = player.getComponent('inventory').container
        
                if (!isAdmin && (KitData.requiredTag && KitData.requiredTag !== 'noReqTag' && !player.hasTag(KitData.requiredTag)))
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.noperms')
                
                const cooldown = Number(player.getTags().find((tag) => tag.startsWith(`KA-Cooldown:${kitName}:`))?.substring(12 + kitName.length + 1)) ?? null;
                if (!isAdmin && (cooldown && cooldown > Date.now())) 
                    return ReclaimSelect(player, translate('inCooldown', [MS(cooldown - Date.now())]))
                if (!isAdmin) {
                    removeAllCooldownTags(player, kitName),
                    player.addTag(`KA-Cooldown:${kitName}:${Date.now() + KitData.cooldown}`)
                }
                
                if (!isAdmin && (KitData.onlyOnce && player.hasTag(`KA-ClaimedKit:${kitName}`))) 
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.onlyonce')
                if (KitData.onlyOnce)
                    player.addTag(`KA-ClaimedKit:${kitName}`)
                
                if (inventory.emptySlotsCount < KitData.itemCount)
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.insufficientslots')
                
                let money = 0;
                try {
                    money = world.scoreboard.getObjective(EconomyObjective).getScore(player.scoreboard)
                } catch {}

                if (!isAdmin && (KitData?.price && KitData?.price > 0 && money < KitData?.price))
                    return ReclaimSelect(player, 'api.kits.errors.reclaim.notenoughmoney')
                if (!isAdmin && (KitData?.price && KitData?.price > 0 && money >= KitData?.price))
                    player.runCommandAsync(`scoreboard players remove @s ${EconomyObjective} ${KitData.price}`)
                
                for (const item of items) {
                    inventory.addItem(newItem(item))
                }
                if (!isAdmin && KitData?.price > 0) {  
                    FormKit(player, translate('purchasedKitSucces', [kitName]))
                    return Script.emit('kitPurchased', {
                        kitName,
                        price: KitData.price,
                        player: player,
                        executionTime: Date.now() - ms + 'ms'
                    })
                }
                FormKit(player, translate('reclaimSucces', [kitName]))
                Script.emit('kitClaimed', {
                    kitName,
                    player: player,
                    executionTime: Date.now() - ms + 'ms'
                })
            break;
            case 1:
                ReclaimSelect(player)
            break;
        }
    })
}