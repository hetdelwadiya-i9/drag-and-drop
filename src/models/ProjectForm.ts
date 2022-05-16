import { autoBind } from "../decorators/autoBind.js";
import { validate } from "../utils/validate.js";
import { ProjectState } from "./ProjectState.js";

const projectState = ProjectState.getInstance();

export class ProjectForm {
       template: HTMLTemplateElement;
       hostDiv: HTMLDivElement;
       formElement: HTMLFormElement;
       titleInput: HTMLInputElement;
       description: HTMLInputElement;
       people: HTMLInputElement;

       constructor() {
              this.template = document.getElementById("project-input")! as HTMLTemplateElement;
              this.hostDiv = document.getElementById("app")! as HTMLDivElement;

              const importedNode = document.importNode(this.template.content, true);
              this.formElement = importedNode.firstElementChild as HTMLFormElement;

              this.titleInput = this.formElement.querySelector("#title")!;
              this.description = this.formElement.querySelector("#description")!;
              this.people = this.formElement.querySelector("#people")!;

              this.addEvent();
              this.attach();
       }

       @autoBind
       private handleSubmit(event: Event) {
              event.preventDefault();
              if (validate({fieldName: "title", value: this.titleInput.value, maxLength: 20, minLength: 5}) && 
                     validate({fieldName: "description", value: this.description.value, maxLength: 20, minLength: 5}) &&
                     validate({fieldName: "people", value: this.people.value, min: 2, max: 10})
              ) {
                     projectState.addProject(this.titleInput.value, this.description.value, parseInt(this.people.value))
                     this.clearForm();
              }    
       }

       private clearForm = () => {
              this.titleInput.value=""
              this.description.value=""
              this.people.value=""
       }

       private addEvent = () => {
              this.formElement.addEventListener("submit", this.handleSubmit)
       }

       private attach = () => {
              this.hostDiv.insertAdjacentElement("afterbegin", this.formElement);
       }
}