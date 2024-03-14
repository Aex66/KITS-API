import { Script } from "../../../lib/Script.js";
import { Create } from "./Create.js";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { kits } from "./Kits.js";
export const FormKit = (player, status) => {
    const MainForm = new ActionFormData()
        .title('api.kits.main.title')
        .body(status ?? 'api.kits.components.default');
    const isAdmin = player.hasTag(Script.adminTag);
    const buttons = [];
    if (isAdmin) {
        MainForm.button('api.kits.main.components.create.text');
        buttons.push(`create`);
    }
    MainForm.button('KITS');
    buttons.push(`kits`);
    MainForm.show(player).then((res) => {
        if (res.canceled && res.cancelationReason === FormCancelationReason.UserBusy)
            return (player.sendMessage({ rawtext: [{ translate: 'api.kits.chattimeout' }] }),
                player.playSound('random.break'));
        const selected = buttons[res.selection];
        switch (selected) {
            case 'create':
                if (!isAdmin)
                    return kits(player);
                Create(player);
                break;
            case 'kits':
                kits(player);
                break;
        }
    });
};
