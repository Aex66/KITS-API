import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { Reclaim } from "./Reclaim.js";
import { ModalFormData } from "@minecraft/server-ui";
export const ReclaimSelect = (player, status) => {
    var _a;
    const Kits = (_a = Script.kits.allKeys()) !== null && _a !== void 0 ? _a : [];
    const KitNames = [];
    Kits === null || Kits === void 0 ? void 0 : Kits.forEach(kit => KitNames.push(kit));
    if (KitNames.length < 1)
        KitNames.push('none');
    const ReclaimSelectForm = new ModalFormData()
        .title('api.kits.reclaim.title')
        .dropdown(status ? status : 'api.kits.reclaimselect.components.default', KitNames, 0);
    ReclaimSelectForm.show(player).then((res) => {
        try {
            if (res.canceled)
                return FormKit(player);
            if (KitNames[0] === 'none' && KitNames.length === 1)
                return FormKit(player, 'api.kits.errors.nokitsfound');
            const KitIndex = res.formValues[0];
            return Reclaim(player, KitNames[KitIndex]);
        }
        catch (e) {
            console.warn(e, e.stack);
        }
    });
};
