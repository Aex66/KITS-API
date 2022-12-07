import { Player, world } from '@minecraft/server'
import { ActionFormResponse } from './response.js'
import { ActionFormData as IActionFormData, ActionFormResponse as IActionFormResponse } from '@minecraft/server-ui'
import { EventEmitter } from '../../../EventEmitter.js'

export class ActionFormData extends EventEmitter {
	protected IActionFormData: IActionFormData
	protected currentResponseIndex: number
	protected components: any[]
	protected title: string
	protected body: string
	protected reShowed: boolean
	constructor() {
		super()
		this.IActionFormData = new IActionFormData()
		this.currentResponseIndex = 0
		this.components = []
	}

	setTitle(titleText: string) {
		this.title = titleText
		this.IActionFormData.title(titleText)
		return this
	}

    setBody(bodyText: string) {
		this.body = bodyText
		this.IActionFormData.body(bodyText)
		return this
	}

	addButton({ text, iconPath, id }: { text: string, iconPath?: string, id: string}) {
		if (this.components.some(component => component.componentType == 'button' && component.id == id))
			throw new Error(`a button with id: ${id} already exists`)

		this.IActionFormData.button(text, iconPath)
		this.components.push({
			text,
			iconPath,
			id,
			responseIndex: this.currentResponseIndex,
			componentType: 'button'
		})
        this.currentResponseIndex++
		return this
	}

	show(user: Player | string, callback?: (response: ActionFormResponse) => void) {
		const player = typeof user == 'string' ? [...world.getPlayers()].find(player => player.nameTag == user || player.name == user) : user
		this.IActionFormData.show(player).then(MojangResponse => {
			const ActionResponse = new ActionFormResponse({
				form: this.IActionFormData,
				components: this.components,
				MojangResponse,
                player,
			})
			this.emit("playerResponse", ActionResponse)
            
            if(!callback) 
			   return;
			callback(ActionResponse), console.warn('EXCUTED')
		})
		return this
	}

	setNoCancel() {
		this.on("playerResponse", (playerResponse) => {
			if (!playerResponse.getExited()) return
			this.show(playerResponse.player)
		})
		return this
	}

	forceShow(user: Player, callback?: (response: ActionFormResponse) => void) {
		const player = typeof user == 'string' ? [...world.getPlayers()].find(player => player.nameTag == user || player.name == user) : user
		this.IActionFormData.show(player).then(MojangResponse => {
			const ModalResponse = new ActionFormResponse({
				form: this.IActionFormData,
				components: this.components,
				MojangResponse,
                player,
			})
			this.emit('playerResponse', ModalResponse)
			if (MojangResponse.cancelationReason === 'userBusy')
			    this.show(user, callback)
			if (!this.reShowed)
			    return (
					player.tell('§cClose any UI to show the form'),
					this.reShowed = true
				)
			if (!callback)
			    return;
			callback(ModalResponse)
		})
	}
}