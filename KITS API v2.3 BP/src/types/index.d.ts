import { Player } from "@minecraft/server"
import { ItemData } from "../extras/Utils.js"
import { ActionFormResponse } from "../lib/Form/types/ActionForm/response.js";
import { ModalFormResponse } from "../lib/Form/types/ModalForm/response.js";

export type EventEmitterEvents = {
    'kitCreated': KitCreatedEvent;
    'kitDeleted': KitDeletedEvent;
    'kitClaimed': KitClaimed;
    'kitPurchased': KitPurchased;
    'playerResponse': ModalFormResponse | ActionFormResponse;
}

export interface KitInformation {
    name: string;
    description: string;
    requiredTag: string; 
    cooldown: number;
    price: number;
    onlyOnce: boolean;
    itemCount: number;
    items: ItemData[];
    createdAt: string;
}
export class KitCreatedEvent {
    /**
     * Name of the kit that has been created
     */
    readonly kitName: string
    /**
     * The player who created the kit
     */
    readonly player: Player
    /**
     * The data of the kit that has been created
     */
    readonly KitData: KitInformation
    /**
     * Time it took to create the kit
     */
    readonly executionTime: string
}

export class KitDeletedEvent {
    /**
     * Name of the kit that has been removed
     */
    readonly kitName: string
    /**
     * The player removed the kit
     */
    readonly player: Player
    /**
     * The data of the kit that has been removed
     */
     readonly KitData: KitInformation
    /**
     * Time it took to delete the kit
     */
    readonly executionTime: string
}

export class KitClaimed {
    /**
     * Name of the kit that has been claimed
     */
    readonly kitName: string
    /**
      * The player who claimed the kit
      */
    readonly player: Player
    /**
      * The data of the kit that has been claimed
      */
    readonly KitData: KitInformation
    /**
     * Time it took to send the kit to the player
     */
    readonly executionTime: string
}

export class KitPurchased {
    /**
     * Name of the kit that has been purchased
     */
    readonly kitName: string
    /**
      * The player who purchased the kit
      */
    readonly player: Player
    /**
      * The price of the kit that has been purchased
      */
    readonly price: number
    /**
     * Time it took to sell the kit to the player
     */
    readonly executionTime: string
}