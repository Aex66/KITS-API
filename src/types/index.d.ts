import { Player } from "@minecraft/server"
import { ItemData } from "../extras/Utils.js"
import { ActionFormResponse } from "../lib/Form/types/ActionForm/response.js";
import { ModalFormResponse } from "../lib/Form/types/ModalForm/response.js";

export type EventEmitterEvents = {
    'create': KitCreatedEvent;
    'delete': KitDeletedEvent;
    'claim': KitClaimed;
    'purchase': KitPurchased;
    'edit': KitEditedEvent;
    'playerResponse': ModalFormResponse | ActionFormResponse;
}

export interface armor {
  helmet?: ItemData;
  chest?: ItemData;
  legs?: ItemData;
  feet?: ItemData;
}
export interface KitInformation {
    name: string;
    image: string;
    slot: number;
    description: string;
    tag: string; 
    duration: string;
    cooldown: number;
    price: number;
    once: boolean;
    itemCount: number;
    items: ItemData[];
    offhand: ItemData;
    armor: armor
    createdAt: string;
}
export class KitCreatedEvent {
    /**
     * The player who created the kit
     */
    readonly player: Player
    /**
     * The data of the kit that has been created
     */
    readonly data: KitInformation
    /**
     * Time it took to create the kit
     */
    readonly executionTime: string
}

export class KitEditedEvent {
  /**
   * The player who edited the kit
   */
  readonly player: Player
  /**
   * The new data of the kit that has been edited
   */
  readonly newData: KitInformation
   /**
   * The old data of the kit that has been edited
   */
   readonly oldData: KitInformation
  /**
   * Time it took to edit the kit
   */
  readonly executionTime: string
}

export class KitDeletedEvent {
    /**
     * The player removed the kit
     */
    readonly player: Player
    /**
     * The data of the kit that has been removed
     */
     readonly data: KitInformation
    /**
     * Time it took to delete the kit
     */
    readonly executionTime: string
}

export class KitClaimed {
    /**
     * Name of the kit that has been claimed
     */
    readonly name: string
    /**
      * The player who claimed the kit
      */
    readonly player: Player
    /**
     * Time it took to send the kit to the player
     */
    readonly executionTime: string
}

export class KitPurchased {
    /**
     * Name of the kit that has been purchased
     */
    readonly name: string
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