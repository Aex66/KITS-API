import { EnchantmentType, ItemTypes, Enchantment, ItemStack, world, Player, EnchantmentList } from "@minecraft/server";
import { MinecraftEnchantmentTypes } from "../mojang-data/mojang-enchantment";

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
    if (!item.hasComponent("enchantments")) return itemData
    //@ts-ignore
    const enchants = item.getComponent('enchantments').enchantments as EnchantmentList
    if (enchants) {
      for (let k in MinecraftEnchantmentTypes) {
        const type = MinecraftEnchantmentTypes[k as keyof typeof MinecraftEnchantmentTypes]
          if (!enchants.hasEnchantment(type)) continue;
          const enchant = enchants.getEnchantment(type);
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
      ItemTypes.get(itemData.id),
      itemData.amount,
    );
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    //@ts-ignore
    const enchants = enchComp?.enchantments;
    if (enchants) {
      for (let enchant of itemData.enchantments) {
        const type = enchant.id
          .replace("minecraft:", "")
          .replace(/_(.)/g, (match) => match[1].toUpperCase());
        if (!type) continue;
        enchants.addEnchantment(new Enchantment(type, enchant.level));
      }
      //@ts-ignore
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

//Blazed is gay