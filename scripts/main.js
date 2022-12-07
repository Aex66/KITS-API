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
import { system, world } from '@minecraft/server';
import { EconomyObjective } from './config.js';
import { importObjectives } from './extras/Utils.js';
import Script from './lib/Script.js';
import './plugins/commands/import.js';
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
