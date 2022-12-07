/**
 * Lang file
 */
export const Lang = {
    reclaimSucces: '§eYou have claimed the kit §c%s',
    viewDefaultStatusMsg: '§e%s\'s §binformation:\n§r§7Description: §r§b%s\n§7RequiredTag: §r§a%s\n§7OnlyOnce: §r§c%s\n§7Cooldown: §b§d%s\n§7Amount of items: §r§c%s\n§7Created at: §r§e%s',
    inCooldown: '§cYou have §e%s §cleft to reclaim this kit again',
    purchasedKitSucces: '§eYou have purchased the kit §c%s'
}

export type languajes = 'English' | 'Spanish'

export const translate = (LangKey: keyof typeof Lang, keys: string[]) => {
    if (!Lang[LangKey])
        throw Error('That LangKey does not exist!')
   let msg = Lang[LangKey]
   keys.forEach(key => msg = msg.replace('%s', key))
   return msg
}