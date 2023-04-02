import { Player, world } from '@minecraft/server'
import { ModalFormResponse } from './response.js'
import { ModalFormData as IModalFormData } from '@minecraft/server-ui'
import { EventEmitter } from '../../../EventEmitter.js'

export class ModalFormData extends EventEmitter {
	protected IModalFormData: IModalFormData
	protected currentResponseIndex: number
	protected components: any[]
	protected title: string
	protected reShowed: boolean
	protected canShow: boolean
	constructor() {
		super()
		this.IModalFormData = new IModalFormData()
		this.currentResponseIndex = 0
		this.components = []
	}

	setTitle(titleText: string) {
		this.title = titleText
		this.IModalFormData.title(titleText)
		return this
	}

	addDropdown({ label, options, defaultValueIndex, id }: { label: string, options: string[], defaultValueIndex?: number, id: string | number }) {
		if (this.components.some(component => component.componentType == 'dropdown' && component.id == id))
			throw new Error(`a dropdown with id: ${id} already exists`)

		this.IModalFormData.dropdown(label, options, defaultValueIndex)
		this.components.push({
			label,
			options,
			defaultValueIndex,
			id,
			responseIndex: this.currentResponseIndex,
			componentType: 'dropdown'
		})
        this.currentResponseIndex++
		return this
	}

	addSlider({ label, minimumValue, maximumValue, valueStep, defaultValue, id }: { label: string, minimumValue: number, maximumValue: number, valueStep?: number, defaultValue?: number, id: string | number }) {
	    if (this.components.some(component => component.componentType == 'slider' && component.id == id))
			throw new Error(`a slider with id: ${id} already exists`)

		this.IModalFormData.slider(label, minimumValue, maximumValue, valueStep, defaultValue)
		this.components.push({
			label,
			minimumValue,
			maximumValue,
			valueStep,
			defaultValue,
			id,
			responseIndex: this.currentResponseIndex,
			componentType: 'slider'
		})
        this.currentResponseIndex++
		return this
	}

	addTogle({ label, defaultValue, id }: { label: string, defaultValue?: boolean, id: string | number }) {
		if (this.components.some(component => component.componentType == 'togle' && component.id == id))
			throw new Error(`a togle with id: ${id} already exists`)

		this.IModalFormData.toggle(label, defaultValue)
		this.components.push({
			label,
			defaultValue,
			id,
			responseIndex: this.currentResponseIndex,
			componentType: 'togle'
		})
        this.currentResponseIndex++
		return this
	}

	addTextField({ label, placeholderText, defaultValue, id }: { label: string, placeholderText?: string, defaultValue?: string, id: string | number }) {
		if (this.components.some(component => component.componentType == 'textField' && component.id == id))
			throw new Error(`a textField with id: ${id} already exists`)

		this.IModalFormData.textField(label, placeholderText, defaultValue)
		this.components.push({
			label,
			placeholderText,
			defaultValue,
			id,
			responseIndex: this.currentResponseIndex,
			componentType: 'textField'
		})
        this.currentResponseIndex++
		return this
	}

	show(user: Player | string, callback?: (response: ModalFormResponse) => void) {
		const player = typeof user == 'string' ? [...world.getPlayers()].find(player => player.nameTag == user || player.name == user) : user
		this.IModalFormData.show(player).then(MojangResponse => {
			const ModalResponse = new ModalFormResponse({
				form: this.IModalFormData,
				components: this.components,
				MojangResponse,
                player,
			})
			this.emit("playerResponse", ModalResponse)
            
            if(!callback) 
			   return;
			callback(ModalResponse), console.warn('EXECUTED')
		})
		return this
	}

	setNoCancel() {
		this.on("playerResponse", (playerResponse: ModalFormResponse) => {
			if (!playerResponse.getExited()) return
			this.show(playerResponse.player.nameTag)
		})
		return this
	}

	forceShow(user: Player, callback?: (response: ModalFormResponse) => void) {
		const player = typeof user == 'string' ? [...world.getPlayers()].find(player => player.nameTag == user || player.name == user) : user
		this.IModalFormData.show(player).then(MojangResponse => {
			const ModalResponse = new ModalFormResponse({
				form: this.IModalFormData,
				components: this.components,
				MojangResponse,
                player,
			})
			this.emit('playerResponse', ModalResponse)
			if (MojangResponse.cancelationReason === 'userBusy') {
			    this.forceShow(user, callback)
				if (!this.reShowed)
			        return (
						player.sendMessage('§cClose any UI to show the form'),
						this.reShowed = true
						)
			} else {
				this.canShow = true
			}

			if (this.canShow) {
				return this.show(user, callback)
			}
		})
	}
}