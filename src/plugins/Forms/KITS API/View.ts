import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconPaths } from "../../../config";
import { MS } from "../../../extras/Converters";
import { translate } from "../../../extras/Lang";
import { KitInformation } from "../../../types";
import { FormKit } from "./FormKit";

export const _view = (player: Player, kit: KitInformation) => {
    const ViewForm = new ActionFormData()
    .title(kit.name)
    .body(translate('viewDefaultStatusMsg', [kit.name, kit?.description, kit?.tag, String(kit?.once ? '§atrue' : 'false'), MS(kit?.cooldown), String(kit?.itemCount), (kit.offhand ? '§atrue' : 'false'), (kit.armor.helmet ? '§atrue' : 'false'), (kit.armor.chest ? '§atrue' : 'false'), (kit.armor.legs ? '§atrue' : 'false'), (kit.armor.feet ? '§atrue' : 'false'), kit?.createdAt]))
    .button(
        'api.kits.view.components.exit.text',
        iconPaths.exit
    )
    ViewForm.show(player).then((res) => {//@ts-ignore
        if (res.canceled && res.cancelationReason !== 'userBusy')
            return FormKit(player)
    })
}