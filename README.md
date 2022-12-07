# KITS-API
KITS API is an addon for minecraft bedrock which will allow you to create and claim KITS in your world with much ease

# HOW TO SETUP
When starting KITS API, if you are a world administrator you have to add the "Admin" tag to be able to create, delete, view kit information and claim them without limitations. Otherwise, you will not be able to create, delete, view kit information or claim them without limitations!

# Modules

<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="KITS API v2.3 RP/textures/emojis/CREATE KIT.png" height="50" /></a>

###### When creating a kit you have several options and settings, such as: <br>
-Name <br>
-Description <br>
-Required tag (The player must have a tag in order to claim the kit) <br>
-Cooldown (The player has to wait to claim the kit again) [ex: 2 days] <br>
-Price (The player has to pay for the kit) <br>
-OnlyOnce (The kit can only be claimed once per player) <br>
**_The kit will take all the items in your inventory (Except for off-hand slots and armor slots)._**

<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="KITS API v2.3 RP/textures/emojis/REMOVE KIT.png" height="50" /></a>

###### This module will allow you to remove a kit from the database, to delete it you have to select it in the dropdown the kit you want to remove (all the current kits on the server will appear in the dropdown) and followed by this write "CONFIRM" in capital letters and without the quotes and the kit will be eliminated, if you write anything else nothing will happen, it will only return you to the form <br>

<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="KITS API v2.3 RP/textures/emojis/VIEW INFO.png" height="50" /></a>

###### When you want to see a kit, you will get a list of the existing kits and clicking send will take you to a form where you can see the following information about the kit:
-Description <br>
-Required tag <br>
-Cooldown <br>
-Price <br>
-OnlyOnce <br>
-ItemCount (The number of slots that the kit items occupy) <br>
-Created At (When the kit was created) <br>

<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="KITS API v2.3 RP/textures/emojis/RECLAIM.png" height="50" /></a>
###### In order to claim a kit, your server members will have to pass all limitations before they can claim it.
-If the kit has "RequiredTag" the member must have the tag set for that kit, in order to claim it. <br>
-If the kit has a "Cooldown", the player will be able to claim it but to be able to claim it again they will have to wait until the cooldown ends <br>
-If the kit is set to be claimed once, once the player claims it they will not be able to claim it again
-If the kit has a price, the player will have to have enough money to be able to claim it and it will be discounted, if he does not have enough money, nothing will be discounted and the kit will not be given to him <br>
**Note: If you are an administrator, none of these limitations will bother you when you want to claim the kit.** <br>

# FOR DEVS
## If you have some knowledge in javascript or typescript, I will show you how you can execute code when some KITS API event is fired


```ts
/**
 * KITS API EVENTS
 */
Script.on('kitCreated', (res) => {
        //Fires when a kit is created
})

Script.on('kitDeleted', (res) => {
        //Fires when a kit is deleted
})

Script.on('kitClaimed', (res) => {
        //Fires when a kit is claimed
})

Script.on('kitPurchased', (res) => {
        //Fires when a kit is purchased
})
```
# MY SOCIAL NETWORKS
<a href="https://www.youtube.com/channel/UCcb6TseFTpboFwgZM737IGA" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" height="50" /></a>
