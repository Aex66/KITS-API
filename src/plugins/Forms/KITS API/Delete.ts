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
import { Player } from "@minecraft/server";
import { KitsApiEvents, Script } from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { KitInformation } from "../../../types/index.js";
import { kits } from "./Kits.js";
export const _delete = (player: Player, kit: KitInformation) => {

    const Kits = Script.kits.allKeys() ?? []
    const KitNames: string[] = []
    Kits?.forEach(kit => KitNames.push(kit))

    if (KitNames.length < 1) KitNames.push('none')


    new ActionFormData()
    .title(`Delete ${kit.name}`)
    .body(`§7Are you sure you want to delete this kit?`)
    .button(`§l§aCONFIRM`)
    .button(`§l§cCANCEL`)
    .show(player).then((res) => {
        if (res.canceled) return kits(player)
        const ms = Date.now()

        Script.kits.delete(kit.name)

        player.sendMessage(`§aSucces deleting kit §r§e${kit.name}`)

        KitsApiEvents.emit('delete', {
            player: player,
            data: kit,
            executionTime: Date.now() - ms + 'ms'
        })
    })
}