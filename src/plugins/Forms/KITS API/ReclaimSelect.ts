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
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { Reclaim } from "./Reclaim.js";
import { ModalFormData } from "@minecraft/server-ui";

export const ReclaimSelect = (player: Player, status?: string) => {
    const Kits = Script.kits.allKeys() ?? []
    const KitNames: string[] = []
    Kits?.forEach(kit => KitNames.push(kit))

    if (KitNames.length < 1) KitNames.push('none')

    const ReclaimSelectForm = new ModalFormData()
    .title('api.kits.reclaim.title')
    .dropdown(
      status ? status : 'api.kits.reclaimselect.components.default',
      KitNames,
      0
    )

    ReclaimSelectForm.show(player).then((res) => {
      try {
      if (res.canceled)
          return FormKit(player)
      if (KitNames[0] === 'none' && KitNames.length === 1)
          return FormKit(player, 'api.kits.errors.nokitsfound')
      const KitIndex = res.formValues[0]
      return Reclaim(player, KitNames[KitIndex])
      } catch (e) {console.warn(e, e.stack)}
    })
}