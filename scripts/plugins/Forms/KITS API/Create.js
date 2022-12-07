import { ModalFormData } from "@minecraft/server-ui";
import { MS } from "../../../extras/Converters.js";
import { getItemData } from "../../../extras/Utils.js";
import Script from "../../../lib/Script.js";
import { FormKit } from "./FormKit.js";
export const Create = (player, status) => {
    const CreateForm = new ModalFormData()
        .title('api.kits.create.title')
        .textField(status ? status : 'api.kits.create.components.default', 'api.kits.create.components.name.placeholder')
        .textField('api.kits.create.components.description.label', 'api.kits.create.components.description.placeholder', 'Default')
        .textField('api.kits.create.components.reqTag.label', 'tag')
        .textField('Cooldown', 'Cooldown')
        .textField('api.kits.create.components.price.label', 'api.kits.create.components.price.placeholder', '0')
        .toggle('api.kits.create.components.onlyonce.label', false);
    CreateForm.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player);
        const ms = Date.now();
        let [name, desc, tag, duration, price, onlyOnce] = res.formValues;
        let cooldown = MS(duration);
        price = Number(price);
        if (!desc)
            desc = 'UNDEFINED';
        if (!name)
            return Create(player, 'api.kits.errors.create.noname');
        if (isNaN(price))
            return Create(player, 'api.kits.errors.create.price.wrongsyntax');
        if (Script.kits.has(name))
            return Create(player, 'api.kits.errors.create.alreadyexist');
        const inventory = player.getComponent('inventory').container;
        const items = [];
        let itemCount = 0;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item)
                continue;
            itemCount++;
            items.push(getItemData(item));
        }
        if (!items.length)
            return Create(player, 'api.kits.errors.create.noitems');
        const data = {
            name,
            description: desc,
            requiredTag: !tag ? "noReqTag" : tag,
            cooldown: !cooldown ? 0 : cooldown,
            price,
            onlyOnce: !onlyOnce ? false : onlyOnce,
            itemCount,
            items: items,
            createdAt: new Date().toLocaleString()
        };
        Script.kits.write(name, data);
        FormKit(player, 'api.kits.create.succes');
        Script.emit('kitCreated', {
            kitName: name,
            player: player,
            kitData: data,
            executionTime: Date.now() - ms + 'ms'
        });
    });
};
