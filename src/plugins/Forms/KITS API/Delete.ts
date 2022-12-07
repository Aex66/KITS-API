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
import { Player } from "@minecraft/server";
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { ModalFormData } from "@minecraft/server-ui";
export const Delete = (player: Player, status?: string) => {

    const Kits = Script.kits.allKeys() ?? []
    const KitNames: string[] = []
    Kits?.forEach(kit => KitNames.push(kit))

    if (KitNames.length < 1) KitNames.push('none')


    const RemoveForm = new ModalFormData()
    .title('api.kits.delete.title')
    .dropdown(
        'api.kits.delete.components.kits.label',
        KitNames,
        0,
    )
    .textField(
        status ? status : 'api.kits.delete.components.default',
        'api.kits.delete.components.confirm.placeholder'
    )

    RemoveForm.show(player).then((res) => {
        if (res.canceled) 
            return FormKit(player)
        const ms = Date.now()
        if (KitNames[0] === 'none' && KitNames.length === 1) 
            return  FormKit(player, 'api.kits.errors.nokitsfound')
        
        const value = res.formValues[1], KitIndex = res.formValues[0]
        if (!value) 
            return Delete(player)
        
        const validValues = ['CONFIRM', 'CONFIRMAR']
        if (!validValues.includes(value)) 
            return Delete(player)

        if (!Script.kits.has(KitNames[KitIndex]))
            return Delete(player)
        const KitData = Script.kits.read(KitNames[KitIndex])
        Script.kits.delete(KitNames[KitIndex])
        FormKit(player, 'api.kits.delete.succes')
        Script.emit('kitDeleted', {
            kitName: KitNames[KitIndex],
            player: player,
            KitData,
            executionTime: Date.now() - ms + 'ms'
        })
    })
}