import { Player } from "@minecraft/server"
import { ActionFormData, ActionFormResponse as IActionFormResponse } from "@minecraft/server-ui"

export class ActionFormResponse {
	protected components
	protected MojangResponse
	public player
	protected form
	constructor({ form, components, MojangResponse, player }: { form: ActionFormData, components: any, MojangResponse: IActionFormResponse, player: Player }) {
		this.MojangResponse = MojangResponse
		this.components = components
		this.player = player
		this.form = form
	}
	
	getExited() {
	  return this.MojangResponse.canceled
	}
	
	getPressedButton() {
		//@ts-ignore
	  return this.components.find(component => component.componentType == 'button' && component.responseIndex == this.MojangResponse.selection).id
	}

	getCancelationReason() {
		return this.MojangResponse.cancelationReason
	}
}