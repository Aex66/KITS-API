import { ModalFormData } from "@minecraft/server-ui";
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
import { View } from "./View.js";
export const ViewSelect = (player, status) => {
    var _a;
    const Kits = (_a = Script.kits.allKeys()) !== null && _a !== void 0 ? _a : [];
    const KitNames = [];
    Kits === null || Kits === void 0 ? void 0 : Kits.forEach(kit => KitNames.push(kit));
    if (KitNames.length < 1)
        KitNames.push('none');
    const ViewSelectForm = new ModalFormData()
        .title('api.kits.view.title')
        .dropdown(status ? status : 'api.kits.viewselect.components.default', KitNames, 0);
    ViewSelectForm.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player);
        if (KitNames[0] === 'none' && KitNames.length === 1)
            return FormKit(player, 'api.kits.errors.nokitsfound');
        const KitIndex = res.formValues[0];
        return View(player, KitNames[KitIndex]);
    });
};
