import { Player } from "@minecraft/server"
import { KitInformation } from "../../../types"
import { ModalFormData } from "@minecraft/server-ui"
import { kits } from "./Kits"
import { MS } from "../../../extras/Converters"
import { KitsApiEvents, Script } from "../../../lib/Script"

export const _edit = (player: Player, kit: KitInformation) => {
        new ModalFormData()
        .title(`Edit ${kit.name}`)
        .textField(
            'Description:',
            'kit for vips',
            kit?.description
        )
        .textField(
            'Tag:',
            'vip',
            kit?.tag
        )
        .textField(
            'Cooldown',
            '1 day 6 hours',
            kit?.duration
        )
        .textField(
            'Price:',
            '500',
            kit?.price?.toString()
        )
        .textField(
            'Image:',
            'minecraft:diamond',
            kit.image
        )
        .textField(
            'Slot:',
            '0',
            kit?.slot?.toString()
        )
        .toggle(
            'Once',
            kit?.once ?? false
        )
        .show(player).then(res => {
            if (res.canceled)
                return kits(player)
            const ms = Date.now()
            let [ desc, tag, duration, price, image, slot, onlyOnce ] = res.formValues as [string, string, string, number, string, number, boolean]
            let cooldown = MS(duration)
            price = Number(price)
            slot = Number(slot)

            if (!desc) desc = kit.description ?? undefined
            if (price !== kit?.price && isNaN(price))
                return player.sendMessage({ translate: 'api.kits.errors.create.price.wrongsyntax' })
            if (kit?.slot !== slot && isNaN(slot))
                return player.sendMessage(`§cThe slot must be a number`)

            const data = {
                name: kit.name,
                image: image !== kit?.image ? image ? image : undefined : kit.image,
                slot: slot !== kit?.slot ? slot : kit?.slot,
                description: desc !== kit?.description ? desc ? desc : undefined : kit?.description,
                tag: tag !== kit?.tag ? tag ? tag : undefined : kit?.tag, 
                duration: duration !== kit?.duration ? duration ? duration : undefined : kit?.duration,
                cooldown: duration ? cooldown : kit?.cooldown,
                price: price !== kit?.price ? price ? price : 0 : kit?.price,
                once: onlyOnce !== kit?.once ? onlyOnce : kit?.once,
                itemCount: kit.itemCount,
                items: kit.items,
                offhand: kit.offhand ?? undefined,
                armor: kit.armor,
                createdAt: new Date().toLocaleString()
            }

            console.warn(JSON.stringify(data))
            Script.kits.write(kit.name, data)

            player.sendMessage(`§aSucces editing kit §r§e${kit.name}`)
            KitsApiEvents.emit('edit', {
                player: player,
                oldData: kit,
                newData: data,
                executionTime: Date.now() - ms + 'ms'
            })
        })
}