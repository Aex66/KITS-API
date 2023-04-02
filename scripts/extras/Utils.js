import { ItemStack, MinecraftEnchantmentTypes, Items, Enchantment, world } from "@minecraft/server";
export const getItemData = (item) => {
    var _a;
    const itemData = {
        id: item.typeId,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: [],
    };
    if (!item.hasComponent("enchantments"))
        return itemData;
    const enchants = (_a = item.getComponent('enchantments')) === null || _a === void 0 ? void 0 : _a.enchantments;
    if (enchants) {
        for (let k in MinecraftEnchantmentTypes) {
            const type = MinecraftEnchantmentTypes[k];
            if (!enchants.hasEnchantment(type))
                continue;
            const enchant = enchants.getEnchantment(type);
            itemData.enchantments.push({
                id: enchant.type.id,
                level: enchant.level,
            });
        }
    }
    return itemData;
};
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData) => {
    const item = new ItemStack(Items.get(itemData.id), itemData.amount);
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    const enchants = enchComp === null || enchComp === void 0 ? void 0 : enchComp.enchantments;
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            const type = MinecraftEnchantmentTypes[key];
            if (!type)
                continue;
            enchants.addEnchantment(new Enchantment(type, enchant.level));
        }
        enchComp.enchantments = enchants;
    }
    return item;
};
/**
 * Import not-existent objectives
 * @param {Array<{ id: string, displayName?: string}>} objectives
 */
export const importObjectives = async (objectives) => {
    const f = objectives.filter(o => !world.scoreboard.getObjective(o.id));
    if (!f.length)
        return;
    f.forEach(o => { var _a; return world.scoreboard.addObjective(o.id, (_a = o.displayName) !== null && _a !== void 0 ? _a : o.id); });
    console.warn("OBJECTIVES IMPORTED!");
};
/**
 * KITS API EXCLUSIVE
 */
export const removeAllCooldownTags = (player, kit) => {
    if (kit)
        return player.getTags().filter(tag => tag.startsWith(`KA-Cooldown:${kit}:`)).forEach(tag => player.removeTag(tag));
    player.getTags().filter(tag => tag.startsWith(`KA-Cooldown:`)).forEach(tag => player.removeTag(tag));
};
