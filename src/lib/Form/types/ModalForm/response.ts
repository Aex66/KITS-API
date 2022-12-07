import { Player } from "@minecraft/server"
import { ModalFormResponse as IModalFormResponse, ModalFormData } from "@minecraft/server-ui"

export class ModalFormResponse {
	protected components
	protected MojangResponse
	public player
	protected form
	constructor({ form, components, MojangResponse, player }: { form: ModalFormData, components: any, MojangResponse: IModalFormResponse, player: Player }) {
		this.MojangResponse = MojangResponse
		this.components = components
		this.player = player
		this.form = form
	}
	
	getExited() {
	  return this.MojangResponse.canceled
	}
	
	getDropdown(id: string | number) {
		//@ts-ignore
	  return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'dropdown').responseIndex]
	}
	
	getSlider(id: string | number) {
		//@ts-ignore
	  return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'slider').responseIndex]
	}
	
	getTogle(id: string | number) {
		//@ts-ignore
	  return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'togle').responseIndex]
	}
	
	getTextField(id: string | number) {
		//@ts-ignore
	  return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'textField').responseIndex]
	}

	getCancelationReason() {
		return this.MojangResponse.cancelationReason
	}
}