import { ModalFormData } from "@minecraft/server-ui";
import { FormKit } from "./FormKit.js";
import { View } from "./View.js";
import { Script } from "../../../lib/Script.js";
export const ViewSelect = (player, status) => {
    const Kits = Script.kits.allKeys() ?? [];
    const KitNames = [];
    Kits?.forEach(kit => KitNames.push(kit));
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
