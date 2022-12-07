import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconPaths } from "../../../config";
import { MS } from "../../../extras/Converters";
import { translate } from "../../../extras/Lang";
import { KitInformation } from "../../../types";
import Script from "../../../lib/Script";
import { FormKit } from "./FormKit";

export const View = (player: Player, KitName: string, status?: string) => {
    const KitData: KitInformation = Script.kits.read(KitName)

    const ViewForm = new ActionFormData()
    .title(KitName)
    .body(status ?? translate('viewDefaultStatusMsg', [KitName, KitData?.description, String(KitData?.onlyOnce), KitData?.requiredTag, MS(KitData?.cooldown), String(KitData?.itemCount), KitData?.createdAt]))
    .button(
        'api.kits.view.components.exit.text',
        iconPaths.exit
    )
    ViewForm.show(player).then((res) => {
        if (res.canceled && res.cancelationReason !== 'userBusy')
            return FormKit(player)
    })
}