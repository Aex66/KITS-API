/**
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
import { iconPaths } from "../../../config.js";
import Script from "../../../lib/Script.js";
import { Create } from "./Create.js";
import { Delete } from "./Delete.js";
import { ReclaimSelect } from "./ReclaimSelect.js";
import { ActionFormData } from "@minecraft/server-ui";
import { ViewSelect } from "./ViewSelect.js";

export const FormKit = (player: Player, status?: string) => {
    const MainForm = new ActionFormData()
    .title('api.kits.main.title')
    .body(status ?? 'api.kits.components.default')

    const isAdmin = player.hasTag(Script.adminTag)
    if (isAdmin) {
        MainForm.button(
            'api.kits.main.components.create.text',
            iconPaths.create
        )
        MainForm.button(
            'api.kits.main.components.delete.text',
            iconPaths.delete,
        )
        MainForm.button(
           'api.kits.main.components.view.text',
           iconPaths.view,
        )
    }
    MainForm.button(
          'api.kits.main.components.reclaim.text',
          iconPaths.reclaim,
    )

    MainForm.show(player).then((res) => {
        if (res.canceled && res.cancelationReason === 'userBusy')
            return (
                player.sendMessage({ rawtext: [ { translate: 'api.kits.chattimeout' } ] }),
                player.playSound('random.break')
            )
        const button = res.selection

        switch(button) {
            case 0:
                if (!isAdmin)
                    return ReclaimSelect(player)
                Create(player)
            break;
            case 1:
                Delete(player)
            break;
            case 2:
                ViewSelect(player)
            break;
            case 3:
                ReclaimSelect(player)
            break;
        }
    })
}