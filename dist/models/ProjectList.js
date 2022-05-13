var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ProjectStatus } from "../ProjectStatus.js";
import { ProjectState } from "./ProjectState.js";
import { autoBind } from "../decorators/autoBind.js";
const projectState = ProjectState.getInstance();
export class ProjectList {
    constructor(type) {
        this.type = type;
        this.renderProjects = () => {
            const list = document.getElementById(`${this.type}-project-list`);
            list.innerHTML = `<div class="accordion accordion-flush" id="${this.type}-accordion"></div>`;
            const accordion = document.getElementById(`${this.type}-accordion`);
            for (const project of this.activeProjects) {
                const projItem = document.createElement("li");
                projItem.innerHTML = `<div class="accordion-item" draggable="true" id="${project.id}">
                            <h2 class="accordion-header" id="headingOne">
                                   <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${"project" + project.id}" aria-expanded="true" aria-controls="collapseOne">
                                          ${project.title}
                                   </button>
                            </h2>
                            <div id="${"project" + project.id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#${this.type}-accordion">
                                   <div class="accordion-body">
                                          <strong>Description: </strong><i>${project.description}</i><br><br>
                                          <strong>Assigned people: </strong><i>${project.people}</i>
                                   </div>
                            </div>
                            </div>`;
                accordion === null || accordion === void 0 ? void 0 : accordion.appendChild(projItem);
                projItem.addEventListener("dragstart", (event) => { this.handleDragStart(event, project.id, project.status); });
                projItem.addEventListener("dragend", this.handleDragEnd);
            }
            this.formElement.addEventListener("dragover", this.handleDragOver);
            this.formElement.addEventListener("drop", this.handleDrop);
            this.formElement.addEventListener("dragleave", this.handleDragLeave);
        };
        this.renderContent = () => {
            const listId = `${this.type}-project-list`;
            this.formElement.querySelector("h2").textContent = this.type.toUpperCase() + " PROJECTS";
            this.formElement.querySelector("ul").id = listId;
        };
        this.attach = () => {
            this.hostDiv.insertAdjacentElement("beforeend", this.formElement);
        };
        this.template = document.getElementById("project-list");
        this.hostDiv = document.getElementById("app");
        const importedNode = document.importNode(this.template.content, true);
        this.formElement = importedNode.firstElementChild;
        this.formElement.id = `${this.type}-projects`;
        this.activeProjects = [];
        projectState.addListner((projects) => {
            const sortedProjects = projects.filter((prj) => {
                if (this.type === "active")
                    return prj.status === ProjectStatus.Active;
                else
                    return prj.status === ProjectStatus.Finished;
            });
            this.activeProjects = sortedProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    handleDragStart(event, projectId, projectStatus) {
        event.dataTransfer.setData("text/plain", projectId.toString());
        event.dataTransfer.setData("text/glain", projectStatus.toString());
        event.dataTransfer.effectAllowed = "move";
    }
    handleDragEnd(_) {
        document.getElementById(this.type + "-project-list").classList.remove("droppable");
    }
    handleDrop(event) {
        event.preventDefault();
        const status = event.dataTransfer.getData("text/glain") == "0" ? ProjectStatus.Finished : ProjectStatus.Active;
        projectState.moveProject(parseInt(event.dataTransfer.getData("text/plain")), status);
        document.getElementById(this.type + "-project-list").classList.remove("droppable");
    }
    handleDragOver(event) {
        if (event.dataTransfer && (event.dataTransfer.types[0] === "text/plain" || event.dataTransfer.types[0] === "text/glain")) {
            event.preventDefault();
        }
        document.getElementById(this.type + "-project-list").classList.add("droppable");
    }
    handleDragLeave(_) {
        document.getElementById(this.type + "-project-list").classList.remove("droppable");
    }
}
__decorate([
    autoBind
], ProjectList.prototype, "handleDragOver", null);
__decorate([
    autoBind
], ProjectList.prototype, "handleDragLeave", null);
//# sourceMappingURL=ProjectList.js.map