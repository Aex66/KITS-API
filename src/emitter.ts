import { KitsApiEvents } from "./lib/Script";

/**
 * KITS API EVENTS
 */
KitsApiEvents.on('create', (res) => {
    const { player, data } = res

    player.sendMessage(`§aCreated the kit §b${data.name}`)
})

KitsApiEvents.on('delete', (res) => {
    const { player, data } = res

    player.sendMessage(`§aDeleted the kit §b${data.name}`)
})

KitsApiEvents.on('claim', (res) => {
    const { player, name } = res

    player.sendMessage(`§aClaimed the kit §b${name}`)
})

KitsApiEvents.on('purchase', (res) => {
    const { player, name } = res

    player.sendMessage(`§aBought the kit §b${name}`)
})

KitsApiEvents.on('edit', (res) => {
    const { player, newData } = res

    player.sendMessage(`§aEdited the kit §b${newData.name}`)
})