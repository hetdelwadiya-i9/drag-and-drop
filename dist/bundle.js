var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("ProjectStatus", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
});
define("decorators/autoBind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoBind = void 0;
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
    exports.autoBind = autoBind;
});
define("interfaces/Validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("utils/alert", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alertGenerator = void 0;
    const alertGenerator = (text, type) => {
        if (type === "error") {
            document.getElementById("alert").innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">` + text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        }
        else {
            document.getElementById("alert").innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">` + text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
        }
    };
    exports.alertGenerator = alertGenerator;
});
define("utils/validate", ["require", "exports", "utils/alert"], function (require, exports, alert_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    const validate = (input) => {
        if (input.value.toString().trim() !== "") {
            if (input.minLength && input.minLength > input.value.toString().trim().length) {
                (0, alert_1.alertGenerator)("Please add a " + input.fieldName + " of length more than 5", "error");
                return false;
            }
            if (input.maxLength && input.maxLength < input.value.toString().trim().length) {
                (0, alert_1.alertGenerator)(input.fieldName + " length can't be more than " + input.maxLength + " letters!", "error");
                return false;
            }
            if (input.max && input.value > input.max) {
                (0, alert_1.alertGenerator)(input.fieldName + " can't be more than " + input.max + "!", "error");
                return false;
            }
            if (input.min && input.value < input.min) {
                (0, alert_1.alertGenerator)(input.fieldName + " length can't be less than " + input.min + "!", "error");
                return false;
            }
            return true;
        }
        else {
            (0, alert_1.alertGenerator)("Please add a " + input.fieldName + "!", "error");
            return false;
        }
    };
    exports.validate = validate;
});
define("models/Project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = void 0;
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("models/ProjectState", ["require", "exports", "ProjectStatus", "utils/alert", "models/Project"], function (require, exports, ProjectStatus_1, alert_2, Project_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectState = void 0;
    class ProjectState {
        constructor() {
            this.projects = [];
            this.listeners = [];
            this.addProject = (title, description, people) => {
                const existingProject = this.projects.find(proj => proj.title === title);
                if (existingProject)
                    return (0, alert_2.alertGenerator)("Please add a project with different title!", "error");
                const newProject = new Project_1.Project(this.projects.length + 1, title, description, people, ProjectStatus_1.ProjectStatus.Active);
                this.projects.push(newProject);
                for (const listenerFn of this.listeners) {
                    listenerFn(this.projects.slice());
                }
                (0, alert_2.alertGenerator)("Congratulations! Project added successfully.", "success");
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
    exports.ProjectState = ProjectState;
    _a = ProjectState;
    ProjectState.getInstance = () => {
        if (_a.instance)
            return _a.instance;
        _a.instance = new ProjectState();
        return _a.instance;
    };
});
define("models/ProjectForm", ["require", "exports", "decorators/autoBind", "utils/validate", "models/ProjectState"], function (require, exports, autoBind_1, validate_1, ProjectState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectForm = void 0;
    const projectState = ProjectState_1.ProjectState.getInstance();
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
            if ((0, validate_1.validate)({ fieldName: "Title", value: this.titleInput.value, maxLength: 20, minLength: 5 }) &&
                (0, validate_1.validate)({ fieldName: "Description", value: this.description.value, maxLength: 20, minLength: 5 }) &&
                (0, validate_1.validate)({ fieldName: "People", value: this.people.value, min: 2, max: 10 })) {
                projectState.addProject(this.titleInput.value, this.description.value, parseInt(this.people.value));
                this.clearForm();
            }
        }
    }
    __decorate([
        autoBind_1.autoBind
    ], ProjectForm.prototype, "handleSubmit", null);
    exports.ProjectForm = ProjectForm;
});
define("interfaces/DragInterfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("models/ProjectList", ["require", "exports", "ProjectStatus", "models/ProjectState", "decorators/autoBind"], function (require, exports, ProjectStatus_2, ProjectState_2, autoBind_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    const projectState = ProjectState_2.ProjectState.getInstance();
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
                        return prj.status === ProjectStatus_2.ProjectStatus.Active;
                    else
                        return prj.status === ProjectStatus_2.ProjectStatus.Finished;
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
            const status = event.dataTransfer.getData("text/glain") == "0" ? ProjectStatus_2.ProjectStatus.Finished : ProjectStatus_2.ProjectStatus.Active;
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
        autoBind_2.autoBind
    ], ProjectList.prototype, "handleDragOver", null);
    __decorate([
        autoBind_2.autoBind
    ], ProjectList.prototype, "handleDragLeave", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "models/ProjectForm", "models/ProjectList"], function (require, exports, ProjectForm_1, ProjectList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new ProjectForm_1.ProjectForm();
    new ProjectList_1.ProjectList("active");
    new ProjectList_1.ProjectList("finished");
});
//# sourceMappingURL=bundle.js.map