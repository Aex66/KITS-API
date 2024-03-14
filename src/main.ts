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
© Copyright 2023 all rights reserved. Do NOT steal, copy the code, or claim it as yours
Thank you
*/
import { BlockSignComponent, DyeColor, Player, system, world } from '@minecraft/server'
import { EconomyObjective } from './config.js'
import { importObjectives } from './extras/Utils.js'
import './plugins/commands/import.js'
import './emitter.js'
import { stringToHex } from './extras/Converters.js'
import { FormKit } from './plugins/Forms/KITS API/FormKit.js'

importObjectives(
        EconomyObjective
)

system.beforeEvents.watchdogTerminate.subscribe(ev => ev.cancel = true)

system.run(() => world.getDimension('overworld').runCommandAsync(`scoreboard players add @a ${EconomyObjective} 0`))

world.afterEvents.entityHitBlock.subscribe((res) => {
        const block = res.hitBlock
        if (!block) return;
        if (!res.damagingEntity || !(res.damagingEntity instanceof Player)) return;

        if (!block.typeId.includes('sign')) return;

        const { damagingEntity: source } = res

        const sign: BlockSignComponent = block.getComponent('sign')
        
        if (stringToHex(sign.getText()) !== '5b4b4954532d4150495d') return;

        sign.setWaxed(true)
        FormKit((source as Player)) 
        sign.setTextDyeColor(DyeColor.Red)
        system.runTimeout(() => sign.setTextDyeColor(), 5)
})

system.runInterval(() => {
        for (const player of world.getPlayers({ tags: ['KITS-API'] })) {
                player.removeTag('KITS-API')
                FormKit(player)
        }
}, 20)