import { setTickTimeout } from "../../extras/Scheduling.js";
import { Command } from "../../lib/Command.js";
import { FormKit } from "../Forms/KITS API/FormKit.js";
new Command({
    name: "kits",
    description: "OPEN KITS API FORM",
    aliases: [],
    admin: false
}, (plr) => {
    plr.tell({ rawtext: [{ translate: 'api.kits.closechat' }] });
    setTickTimeout(() => FormKit(plr), 20);
});
