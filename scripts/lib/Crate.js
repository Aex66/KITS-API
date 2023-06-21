import { ItemStack, Player, world, Location } from "@minecraft/server";
import { itemStackIsEqual } from "../extras/Utils";
const config = {
    openCrateSound: 'random.levelup',
    openCrateMessage: `§aSuccesfully opened a§r %crateType§e crate!`
};
export const crates = {};
export class Crate {
    constructor(location, id) {
        this.location = location;
        const [x, y, z, dim] = location;
        if (!Object.keys(crates).includes(`${x}_${y}_${z}_${dim}`))
            crates[`${x}_${y}_${z}_${dim}`] = {
                id,
                rewards: [],
                type: undefined,
                key: undefined
            };
    }
    setReward(reward) {
        const [x, y, z, dim] = this.location;
        crates[`${x}_${y}_${z}_${dim}`].rewards.push(reward);
    }
    setKey(key) {
        const [x, y, z, dim] = this.location;
        crates[`${x}_${y}_${z}_${dim}`].key = key;
    }
    setType(type) {
        const [x, y, z, dim] = this.location;
        crates[`${x}_${y}_${z}_${dim}`].type = type;
    }
    open(player) {
        const [x, y, z, dim] = this.location;
        const rewardsList = crates[`${x}_${y}_${z}_${dim}`].rewards;
        console.warn(JSON.stringify(rewardsList));
        const rewards = rewardsList[~~(Math.random() * rewardsList.length)];
        rewards.forEach((reward) => {
            if ((reward instanceof ItemStack)) {
                const { x, y, z } = player.location;
                player.dimension.spawnItem(reward, new Location(x, y, z));
            }
            else {
                player.runCommandAsync(`structure load ${reward} ~ ~ ~`);
            }
        });
    }
}
world.events.beforeItemUseOn.subscribe((res) => {
    if (!res.source || !(res.source instanceof Player))
        return;
    const { x, y, z } = res.blockLocation;
    const dim = res.source.dimension;
    const val = Object.keys(crates).find(k => k === `${x}_${y}_${z}_${dim.id}`);
    if (!val)
        return;
    const crate = crates[val];
    const inv = res.source.getComponent('inventory').container;
    const item = inv.getItem(res.source.selectedSlot);
    const slot = inv.getSlot(res.source.selectedSlot);
    if (!item)
        return;
    if (!itemStackIsEqual(item, crate.key))
        return;
    res.cancel = true;
    --slot.amount;
    new Crate([x, y, z, dim.id], 'common').open(res.source);
    res.source.sendMessage(config.openCrateMessage.replace('%crateType', crate.type));
    res.source.playSound(config.openCrateSound);
});
