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
import { Player } from "@minecraft/server";
import { FormKit } from "./FormKit.js";
import { Script } from "../../../lib/Script.js";
import { KitInformation } from "../../../types/index.js";
import { ChestGui } from "../../../lib/ChestGui.js";
import { MS } from "../../../extras/Converters.js";
import { ActionFormData } from "@minecraft/server-ui";
import { _delete } from "./Delete.js";
import { _edit } from "./Edit.js";
import { _view } from "./View.js";
import { _claim } from "./Reclaim.js";

export const kits = (player: Player) => {
    const Kits = Script.kits.allValues() as KitInformation[]
    const validKits = [] as KitInformation[]
    if (Kits.length < 1) return player.sendMessage(`§cThere are no kits in this server`)

    const form = new ChestGui()
    form.setType('54')
    form.title('KITS API')
    Kits.forEach(kit => {
      if (kit.tag && !player.hasTag(kit.tag) && !player.hasTag(Script.adminTag)) return;
      if (kit.once && player.getDynamicProperty(`ClaimedKit:${kit.name}`) as boolean && !player.hasTag(Script.adminTag)) return;
      const lore = [
        kit?.description ? splitString(kit.description, 35) : 'No description',
        ``,
        `§cDetails:`,
        `§7Once: §e${kit.once}`, 
        `§7Tag: §e${kit.tag ? kit.tag : 'No tag'}`, 
        `§7Cooldown: §e${kit.duration ? MS(kit.cooldown) : 'No cooldown'}`,
        `§7Price: §e${kit.price ? kit.price : 'Free'}`,
        ``,
        `${player.hasTag(Script.adminTag) ? `§7Click to see options` : `§7Click to claim`}`,
        ``,
        `§aCreated at ${kit.createdAt}`
      ].flat()
      validKits.push(kit)
      form.item(kit?.slot ?? ~~(Math.random() * 54), `§d${kit.name}`, lore, kit?.image ?  kit.image : 'minecraft:standing_banner', 1, false, [])
    })

    form.show(player).then((res) => {
      if (res.canceled) return FormKit(player)
      const selected = validKits.find(kit => kit.slot === res.selection)
      if (!selected) return;

      if (player.hasTag(Script.adminTag)) {
        const question = new ActionFormData()
        question.title(`§l§9KIT OPTIONS`)
        question.button(`§l§eCLAIM KIT`)
        question.button(`§l§dDELETE KIT`)
        question.button(`§l§bVIEW KIT`)
        question.button(`§l§cEDIT KIT`)
        question.show(player).then(answer => {
          if (answer.canceled) return kits(player)
          switch(answer.selection) {
            case 0: _claim(player, selected); break;
            case 1: _delete(player, selected); break;
            case 2: _view(player, selected); break;
            case 3: _edit(player, selected); break;
          }
        })
        return;
      }
      return _claim(player, selected)
    })
}

function splitString(text: string, every: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < text.length; i += every) {
      result.push(text.substr(i, every));
  }
  return result
}