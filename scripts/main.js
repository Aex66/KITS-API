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
© Copyright 2022 all rights reserved. Do NOT steal, copy the code, or claim it as yours
Thank you
*/
import { DyeColor, system, world } from '@minecraft/server';
import { EconomyObjective } from './config.js';
import { importObjectives } from './extras/Utils.js';
import Script from './lib/Script.js';
import './plugins/commands/import.js';
import { stringToHex } from './extras/Converters.js';
import { FormKit } from './plugins/Forms/KITS API/FormKit.js';
importObjectives([
    {
        id: EconomyObjective,
        displayName: EconomyObjective
    }
]);
system.events.beforeWatchdogTerminate.subscribe(ev => ev.cancel = true);
system.run(() => world.getDimension('overworld').runCommandAsync(`scoreboard players add @a ${EconomyObjective} 0`));
/**
 * KITS API EVENTS
 */
Script.on('kitCreated', (res) => {
    //Fires when a kit is created
});
Script.on('kitDeleted', (res) => {
    //Fires when a kit is deleted
});
Script.on('kitClaimed', (res) => {
    //Fires when a kit is claimed
});
Script.on('kitPurchased', (res) => {
    //Fires when a kit is purchased
});
const log = new Map();
world.events.beforeItemUseOn.subscribe((res) => {
    var _a;
    if (Date.now() < ((_a = log.get(res.source.id)) !== null && _a !== void 0 ? _a : 0))
        return;
    const block = res.source.dimension.getBlock(res.getBlockLocation());
    if (!block.typeId.includes('sign'))
        return;
    //@ts-ignore
    const sign = block.getComponent('sign');
    //@ts-ignore
    if (stringToHex(sign.getText()) !== '5b4b4954532d4150495d')
        return;
    res.cancel = true;
    FormKit(res.source);
    log.set(res.source.id, Date.now() + 500);
    sign.setTextDyeColor(DyeColor.red);
    system.runTimeout(() => sign.setTextDyeColor(), 5);
});
system.runInterval(() => {
    for (const player of world.getPlayers({ tags: ['KITSAPI-UI'] })) {
        player.removeTag('KITSAPI-UI');
        FormKit(player);
    }
}, 20);
