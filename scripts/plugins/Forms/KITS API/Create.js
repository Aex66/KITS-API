/*
Developers:
Aex66:
Discord: Aex66#0202
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
           _____
          /  _  \   ____ ___  ___
         /  /_\  \_/ __ \\  \/  /
        /    |    \  ___/ >    <
        \____|__  /\___  >__/\_ \
                \/     \/      \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved. Do NOT steal, copy the code, or claim it as yours.
Thank you
*/
import { EquipmentSlot } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { MS } from "../../../extras/Converters.js";
import { getItemData } from "../../../extras/Utils.js";
import { FormKit } from "./FormKit.js";
import { KitsApiEvents, Script } from "../../../lib/Script.js";
export const Create = (player, status) => {
    const CreateForm = new ModalFormData()
        .title('api.kits.create.title')
        .textField(status ? status : 'api.kits.create.components.default', 'api.kits.create.components.name.placeholder')
        .textField('api.kits.create.components.description.label', 'api.kits.create.components.description.placeholder', 'Default')
        .textField('api.kits.create.components.reqTag.label', 'tag')
        .textField('Cooldown', 'Cooldown')
        .textField('api.kits.create.components.price.label', 'api.kits.create.components.price.placeholder', '0')
        .textField('Image:', 'minecraft:diamond')
        .textField('Slot:', '0')
        .toggle('api.kits.create.components.onlyonce.label', false);
    CreateForm.show(player).then((res) => {
        if (res.canceled)
            return FormKit(player);
        const ms = Date.now();
        let [name, desc, tag, duration, price, image, slot, onlyOnce] = res.formValues;
        let cooldown = MS(duration);
        price = Number(price);
        slot = Number(slot);
        if (!desc)
            desc = 'UNDEFINED';
        if (!name)
            return Create(player, 'api.kits.errors.create.noname');
        if (isNaN(price))
            return Create(player, 'api.kits.errors.create.price.wrongsyntax');
        if (isNaN(slot))
            return Create(player, `§cThe slot must be a number`);
        if (Script.kits.has(name))
            return Create(player, 'api.kits.errors.create.alreadyexist');
        //@ts-ignore
        const inventory = player.getComponent('inventory').container, equipment = player.getComponent('equippable');
        const items = [], offhand = getItemData(equipment.getEquipment(EquipmentSlot.Offhand)), armor = {
            helmet: getItemData(equipment.getEquipment(EquipmentSlot.Head)) ?? undefined,
            chest: getItemData(equipment.getEquipment(EquipmentSlot.Chest)) ?? undefined,
            legs: getItemData(equipment.getEquipment(EquipmentSlot.Legs)) ?? undefined,
            feet: getItemData(equipment.getEquipment(EquipmentSlot.Feet)) ?? undefined
        };
        let itemCount = 0;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item)
                continue;
            itemCount++;
            items.push(getItemData(item));
        }
        if (!items.length && !Object.keys(armor).some((k) => armor[k]) && !offhand)
            return Create(player, 'api.kits.errors.create.noitems');
        const data = {
            name,
            image: image ?? undefined,
            slot: slot,
            description: desc,
            tag: !tag ? undefined : tag,
            duration,
            cooldown: !cooldown ? 0 : cooldown,
            price,
            once: !onlyOnce ? false : onlyOnce,
            itemCount,
            items: items,
            offhand: offhand ?? undefined,
            armor,
            createdAt: new Date().toDateString()
        };
        Script.kits.write(name, data);
        FormKit(player, 'api.kits.create.succes');
        KitsApiEvents.emit('create', {
            player: player,
            data: data,
            executionTime: Date.now() - ms + 'ms'
        });
    }).catch((r) => console.warn(r, r.stack));
};
