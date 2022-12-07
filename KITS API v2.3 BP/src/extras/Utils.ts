import { EnchantmentType, ItemStack, MinecraftEnchantmentTypes, Items, Enchantment, world, Player } from "@minecraft/server";

interface EnchantmentData {
    id: string;
    level: number
}
export interface ItemData {
    id: string;
    data: number;
    amount: number;
    nameTag: string;
    lore: string[];
    enchantments?: EnchantmentData[]
}
export const getItemData = (item: ItemStack) => {
    const itemData: ItemData = {
      id: item.typeId,
      data: item.data,
      amount: item.amount,
      nameTag: item.nameTag,
      lore: item.getLore(),
      enchantments: [],
    }
    if (!item.hasComponent("enchantments")) return itemData
    const enchants = item.getComponent('enchantments')?.enchantments;
        if (enchants) {
    for (let k in MinecraftEnchantmentTypes) {
        const type: EnchantmentType | MinecraftEnchantmentTypes = MinecraftEnchantmentTypes[k as keyof typeof MinecraftEnchantmentTypes]
        if (!enchants.hasEnchantment(type as EnchantmentType)) continue;
        const enchant = enchants.getEnchantment(type as EnchantmentType);
        itemData.enchantments.push({
          id: enchant.type.id,
          level: enchant.level,
        });
      }
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
      Items.get(itemData.id),
      itemData.amount,
      itemData.data
    );
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    const enchants = enchComp?.enchantments;
    if (enchants) {
      for (let enchant of itemData.enchantments) {
        const key = enchant.id
          .replace("minecraft:", "")
          .replace(/_(.)/g, (match) => match[1].toUpperCase());
        const type = MinecraftEnchantmentTypes[key as keyof typeof MinecraftEnchantmentTypes];
        if (!type) continue;
        enchants.addEnchantment(new Enchantment(type as EnchantmentType, enchant.level));
      }
      enchComp.enchantments = enchants;
    }
    return item;
}

/**
 * Import not-existent objectives
 * @param {Array<{ id: string, displayName?: string}>} objectives 
 */
export const importObjectives = async (objectives: Array<{ id: string, displayName?: string}>) => {
  const f = objectives.filter(o => !world.scoreboard.getObjective(o.id))
  if (!f.length)
      return;
  f.forEach(o => world.scoreboard.addObjective(o.id, o.displayName ?? o.id))
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