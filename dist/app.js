"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.projects = [];
        this.listeners = [];
        this.addProject = (title, description, people) => {
            const newProject = new Project(this.projects.length + 1, title, description, people, ProjectStatus.Active);
            this.projects.push(newProject);
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        };
        this.moveProject = (projectId, newStatus) => {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project) {
                project.status = newStatus;
                for (const listenerFn of this.listeners) {
                    listenerFn(this.projects.slice());
                }
            }
        };
        this.addListner = (listnerFn) => {
            this.listeners.push(listnerFn);
        };
    }
}
_a = ProjectState;
ProjectState.getInstance = () => {
    if (_a.instance)
        return _a.instance;
    _a.instance = new ProjectState();
    return _a.instance;
};
const projectState = ProjectState.getInstance();
const validate = (input) => {
    if (input.value.toString().trim() !== "") {
        if (input.minLength && input.minLength > input.value.toString().trim().length) {
            alertGenerator("Please add a " + input.fieldName + " of length more than 5", "error");
            return false;
        }
        if (input.maxLength && input.maxLength < input.value.toString().trim().length) {
            alertGenerator(input.fieldName + " length can't be more than " + input.maxLength + " letters!", "error");
            return false;
        }
        if (input.max && input.value > input.max) {
            alertGenerator(input.fieldName + " can't be more than " + input.max + "!", "error");
            return false;
        }
        if (input.min && input.value < input.min) {
            alertGenerator(input.fieldName + " length can't be less than " + input.min + "!", "error");
            return false;
        }
        return true;
    }
    else {
        alertGenerator("Please add a " + input.fieldName + "!", "error");
        return false;
    }
};
const alertGenerator = (text, type) => {
    if (type === "error") {
        document.getElementById("alert").className = "alert alert-danger text-center fw-bold mt-4";
        document.getElementById("alert").innerHTML = text;
    }
    else {
        document.getElementById("alert").className = "alert alert-success text-center fw-bold mt-4";
        document.getElementById("alert").innerHTML = text;
    }
};
function autoBind(_, _2, descriptor) {
    const method = descriptor.value;
    const ajtDescriptor = {
        configurable: true,
        get() {
            const bound = method.bind(this);
            return bound;
        }
    };
    return ajtDescriptor;
}
class ProjectList {
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
class ProjectForm {
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
            alertGenerator("Congratulations! Project added successfully.", "success");
            this.clearForm();
        }
    }
}
__decorate([
    autoBind
], ProjectForm.prototype, "handleSubmit", null);
const projectForm = new ProjectForm();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
//# sourceMappingURL=app.js.map