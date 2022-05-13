var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autoBind } from "../decorators/autoBind.js";
import { validate } from "../utils/validate.js";
import { ProjectState } from "./ProjectState.js";
const projectState = ProjectState.getInstance();
export class ProjectForm {
    constructor() {
        this.clearForm = () => {
            this.titleInput.value = "";
            this.description.value = "";
            this.people.value = "";
        };
        this.addEvent = () => {
            this.formElement.addEventListener("submit", this.handleSubmit);
        };
        this.attach = () => {
            this.hostDiv.insertAdjacentElement("afterbegin", this.formElement);
        };
        this.template = document.getElementById("project-input");
        this.hostDiv = document.getElementById("app");
        const importedNode = document.importNode(this.template.content, true);
        this.formElement = importedNode.firstElementChild;
        this.titleInput = this.formElement.querySelector("#title");
        this.description = this.formElement.querySelector("#description");
        this.people = this.formElement.querySelector("#people");
        this.addEvent();
        this.attach();
    }
    handleSubmit(event) {
        event.preventDefault();
        if (validate({ fieldName: "Title", value: this.titleInput.value, maxLength: 20, minLength: 5 }) &&
            validate({ fieldName: "Description", value: this.description.value, maxLength: 20, minLength: 5 }) &&
            validate({ fieldName: "People", value: this.people.value, min: 2, max: 10 })) {
            projectState.addProject(this.titleInput.value, this.description.value, parseInt(this.people.value));
            this.clearForm();
        }
    }
}
__decorate([
    autoBind
], ProjectForm.prototype, "handleSubmit", null);
//# sourceMappingURL=ProjectForm.js.map