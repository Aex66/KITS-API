# KITS-API
[KITS API](https://mcpedl.com/kits-api/) is an addon for minecraft bedrock which will allow you to create and claim KITS in your world with much ease
# HOW TO SETUP
When starting the KITS API, if you are a server administrator, you must add the "Admin" tag to be able to create, delete, view kit information, and claim them without limitations. Otherwise, you will not be able to create, delete, view kit information or claim them without limitations! Now that you have this clear, run the command **"ka?kits"** in chat to open the **KITS API** form

# Modules

<a href="#"><img align="center" src="assets/CREATE KIT.png" height="50" /></a>

###### When creating a kit you have several options and settings, such as: <br>
-Name <br>
-Description <br>
-Required tag (The player must have a tag in order to claim the kit) <br>
-Cooldown (The player has to wait to claim the kit again) [ex: 2 days] <br>
-Price (The player has to pay for the kit) <br>
-OnlyOnce (The kit can only be claimed once per player) <br>
**_The kit will take all the items in your inventory (Except for off-hand slots and armor slots)._**

<a href="#" target="blank"><img align="center" src="assets/REMOVE KIT.png" height="50" /></a>

###### This module will allow you to remove a kit from the database, to delete it you have to select it in the dropdown the kit you want to remove (all the current kits on the server will appear in the dropdown) and followed by this write "CONFIRM" in capital letters and without the quotes and the kit will be eliminated, if you write anything else nothing will happen, it will only return you to the form <br>

<a href="#" target="blank"><img align="center" src="assets/VIEW INFO.png" height="50" /></a>

###### When you want to see a kit, you will get a list of the existing kits and clicking send will take you to a form where you can see the following information about the kit:
-Description <br>
-Required tag <br>
-Cooldown <br>
-Price <br>
-OnlyOnce <br>
-ItemCount (The number of slots that the kit items occupy) <br>
-Created At (When the kit was created) <br>

<a href="#" target="blank"><img align="center" src="assets/RECLAIM.png" height="50" /></a>
###### In order to claim a kit, your server members will have to pass all limitations before they can claim it.
-If the kit has "RequiredTag" the member must have the tag set for that kit, in order to claim it. <br>
-If the kit has a "Cooldown", the player will be able to claim it but to be able to claim it again they will have to wait until the cooldown ends <br>
-if the kit has the flag "onlyOnce" when the player claims the kit, they will not be able to claim it again.
-If the kit has a price, the player will have to have enough money to be able to claim it and it will be discounted, if he does not have enough money, nothing will be discounted and the kit will not be given to him <br>
**Note: If you are an administrator, none of these limitations will bother you when you want to claim the kit.** <br>

# FOR DEVS
If you have some knowledge in javascript or typescript, I will show you how you can execute code when some KITS API event is fired

# KITS API EVENTS 

## kitCreated
```ts
Script.on('kitCreated', (res) => {
   res.kitName
   res.player
   res.kitData
   res.executionTime
})
```
This event will be triggered when a kit is successfully created. <br>
Propertys: <br>
-kitName: string (The name of the kit that has been created) <br>
-player: @minecraft/server.Player (The player who created the kit) <br>
-kitData: KitInformation (All the information of the kit that has been created. If you use the typescript version, all the properties are typed to make it easier for you.) <br>
-executionTime: string (Time it took to create the kit) <br><br>

## kitDeleted
```ts
Script.on('kitDeleted', (res) => {
   res.kitName
   res.player
   res.kitData
   res.executionTime
})
```
This event will be triggered when a kit is successfully deleted. <br>
Propertys: <br>
-kitName: string (The name of the kit that has been deleted) <br>
-player: @minecraft/server.Player (The player who deleted the kit) <br>
-kitData: KitInformation (All the information of the kit that has been deleted. If you use the typescript version, all the properties are typed to make it easier for you.) <br>
-executionTime: string (Time it took to delete the kit) <br><br>

## kitClaimed
```ts
Script.on('kitClaimed', (res) => {
   res.kitName
   res.player
   res.executionTime
})
```
This event will be triggered when a kit is successfully claimed. <br>
Propertys: <br>
-kitName: string (The name of the kit that has been claimed) <br>
-player: @minecraft/server.Player (The player who claimed the kit) <br>
-executionTime: string (Time it took to send the kit to the player) <br><br>

## kitPurchased
```ts
Script.on('kitPurchased', (res) => {
   res.kitName
   res.player
   res.price
   res.executionTime
})
```
This event will trigger when a kit is successfully purchased. <br>
Propertys: <br>
-kitName: string (The name of the kit that has been purchased) <br>
-player: @minecraft/server.Player (The player who purchased the kit) <br>
-price: number (The price of the kit that has been purchased) <br>
-executionTime: string (Time it took to send the kit to the player) <br><br>

**_EXAMPLE_** <br>
```main.ts```
```ts
import { Location } from "@minecraft/server"
import Script from './lib/Script.js'
Script.on('kitCreated', (res) => {
    const { x, y, z } = res.player.location
    const entity = res.player.dimension.spawnEntity('minecraft:armor_stand', new Location(x, y, z))
    entity.nameTag = `You have created the kit ${res.kitName} succesfully`
    entity.kill()
})
```
# Download
<a href="https://www.mediafire.com/file/y6qmg6174es9wo6/KITS_API_v2.3.mcaddon/file" target="blank"><img align="center" src="https://cdn.worldvectorlogo.com/logos/mediafire-1-3.svg" height="50" /></a>

# MY SOCIAL NETWORKS
<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" height="50" /></a>
