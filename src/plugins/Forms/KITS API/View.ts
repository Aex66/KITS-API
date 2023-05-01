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
    .body(status ?? translate('viewDefaultStatusMsg', [KitName, KitData?.description, KitData?.requiredTag, String(KitData?.onlyOnce ? '§atrue' : 'false'), MS(KitData?.cooldown), String(KitData?.itemCount), (KitData.offhand ? '§atrue' : 'false'), (KitData.armor.helmet ? '§atrue' : 'false'), (KitData.armor.chest ? '§atrue' : 'false'), (KitData.armor.legs ? '§atrue' : 'false'), (KitData.armor.feet ? '§atrue' : 'false') ,KitData?.createdAt]))
    .button(
        'api.kits.view.components.exit.text',
        iconPaths.exit
    )
    ViewForm.show(player).then((res) => {
        if (res.canceled && res.cancelationReason !== 'userBusy')
            return FormKit(player)
    })
}