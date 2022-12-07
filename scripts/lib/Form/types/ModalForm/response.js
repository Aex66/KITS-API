export class ModalFormResponse {
    constructor({ form, components, MojangResponse, player }) {
        this.MojangResponse = MojangResponse;
        this.components = components;
        this.player = player;
        this.form = form;
    }
    getExited() {
        return this.MojangResponse.canceled;
    }
    getDropdown(id) {
        //@ts-ignore
        return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'dropdown').responseIndex];
    }
    getSlider(id) {
        //@ts-ignore
        return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'slider').responseIndex];
    }
    getTogle(id) {
        //@ts-ignore
        return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'togle').responseIndex];
    }
    getTextField(id) {
        //@ts-ignore
        return this.MojangResponse.formValues[this.components.find(component => component.id == id && component.componentType == 'textField').responseIndex];
    }
    getCancelationReason() {
        return this.MojangResponse.cancelationReason;
    }
}
