import { ItemTypes, ItemStack, world, Player, EnchantmentType, EnchantmentTypes, ItemEnchantableComponent } from "@minecraft/server";
const enchantmentList = ['aqua_affinity', 'bane_of_arthropods', 'binding', 'blast_protection', 'channeling', 'depth_strider', 'efficiency', 'feather_falling', 'fire_aspect', 'fire_protection', 'flame', 'fortune', 'frost_walker', 'impaling', 'infinity', 'knockback', 'looting', 'loyalty', 'luck_of_the_sea', 'lure', 'mending', 'multishot', 'piercing', 'power', 'projectile_protection', 'protection', 'punch', 'quick_charge', 'respiration', 'riptide', 'sharpness', 'silk_touch', 'smite', 'soul_speed', 'swift_sneak', 'thorns', 'unbreaking', 'vanishing']

interface EnchantmentData {
    id: string;
    level: number
}
export interface ItemData {
    id: string;
    amount: number;
    nameTag: string;
    lore: string[];
    enchantments?: EnchantmentData[]
}
export const getItemData = (item: ItemStack) => {
    if (!item) return undefined
    const itemData: ItemData = {
      id: item.typeId,
      amount: item.amount,
      nameTag: item.nameTag,
      lore: item.getLore(),
      enchantments: [],
    }
    if (!item.hasComponent("enchantable")) return itemData
    const enchants = item.getComponent('minecraft:enchantable')
    for(let k of enchantmentList) {
        const type = EnchantmentTypes.get(k);
        if (!type || !enchants.hasEnchantment(k)) continue;
        const enchant = enchants.getEnchantment(type);
        itemData.enchantments.push({
            id: type.id,
            level: enchant.level,
        });
    } 
    return itemData;
}
  
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData: ItemData) => {
    const item = new ItemStack(
      ItemTypes.get(itemData.id),
      itemData.amount,
    );
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);

    const enchComp = item.getComponent('minecraft:enchantable') as ItemEnchantableComponent,
    enchants = enchComp?.getEnchantments();
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const type = EnchantmentTypes.get(enchant.id)
            enchComp.addEnchantment({ type, level: enchant.level });
        }
    }
    return item
}

/**
 * Import not-existent objectives
 * @param {Array<{ id: string, displayName?: string}>} objectives 
 */
export const importObjectives = async (...objectives: string[]) => {
  const f = objectives.filter(o => !world.scoreboard.getObjective(o))
  if (!f.length)
      return;
  f.forEach(o => world.scoreboard.addObjective(o))
  console.warn("OBJECTIVES IMPORTED!")
}

/**
 * KITS API EXCLUSIVE
 */
export const removeAllCooldownTags = (player: Player, kit?: string) => {
  if (kit)
      return player.getTags().filter(tag => tag.startsWith(`KA-Cooldown:${kit}:`)).forEach(tag => player.removeTag(tag))
  player.getTags().filter(tag => tag.startsWith(`KA-Cooldown:`)).forEach(tag => player.removeTag(tag))
}

//Blazed is gay