/**
 * Lang file
 */
export const Lang = {
    reclaimSucces: '§eYou have claimed the kit §c%s',
    viewDefaultStatusMsg: '§e%s\'s §binformation:\n§r§7Description: §r§b%s\n§7Tag: §r§a%s\n§7Once: §r§c%s\n§7Cooldown: §b§d%s\n§7Amount of items: §r§c%s\n§7Offhand: §r§c%s\n§7Head: §r§c%s\n§7Chest: §r§c%s\n§7Legs: §r§c%s\n§7Feet: §r§c%s\n§7Created at: §r§e%s',
    inCooldown: '§cYou have §e%s §cleft to reclaim this kit again',
    purchasedKitSucces: '§eYou have purchased the kit §c%s'
};
export const translate = (LangKey, keys) => {
    if (!Lang[LangKey])
        throw Error('That LangKey does not exist!');
    let msg = Lang[LangKey];
    keys.forEach(key => msg = msg.replace('%s', key));
    return msg;
};
