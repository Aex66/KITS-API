import { ActionFormData } from "@minecraft/server-ui";
import { iconPaths } from "../../../config";
import { MS } from "../../../extras/Converters";
import { translate } from "../../../extras/Lang";
import Script from "../../../lib/Script";
import { FormKit } from "./FormKit";
export const View = (player, KitName, status) => {
    const KitData = Script.kits.read(KitName);
    const ViewForm = new ActionFormData()
        .title(KitName)
        .body(status !== null && status !== void 0 ? status : translate('viewDefaultStatusMsg', [KitName, KitData === null || KitData === void 0 ? void 0 : KitData.description, KitData === null || KitData === void 0 ? void 0 : KitData.requiredTag, String(KitData === null || KitData === void 0 ? void 0 : KitData.onlyOnce), KitData === null || KitData === void 0 ? void 0 : KitData.requiredTag, MS(KitData === null || KitData === void 0 ? void 0 : KitData.cooldown), String(KitData === null || KitData === void 0 ? void 0 : KitData.itemCount), KitData === null || KitData === void 0 ? void 0 : KitData.createdAt]))
        .button('api.kits.view.components.exit.text', iconPaths.exit);
    ViewForm.show(player).then((res) => {
        if (res.canceled && res.cancelationReason !== 'userBusy')
            return FormKit(player);
    });
};
