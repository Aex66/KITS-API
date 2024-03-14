export class ActionFormResponse {
    components;
    MojangResponse;
    player;
    form;
    constructor({ form, components, MojangResponse, player }) {
        this.MojangResponse = MojangResponse;
        this.components = components;
        this.player = player;
        this.form = form;
    }
    getExited() {
        return this.MojangResponse.canceled;
    }
    getPressedButton() {
        //@ts-ignore
        return this.components.find(component => component.componentType == 'button' && component.responseIndex == this.MojangResponse.selection).id;
    }
    getCancelationReason() {
        return this.MojangResponse.cancelationReason;
    }
}
