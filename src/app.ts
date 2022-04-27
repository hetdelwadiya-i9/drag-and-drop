enum ProjectStatus {Active, Finished}

class Project {
       constructor(public id: number, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

type Listner = (items: Project[]) => void;

class ProjectState {
       private projects: Project[] = []
       private static instance: ProjectState;
       private listeners: Listner[] = [];

       private constructor() {}

       static getInstance =() => {
              if(this.instance) 
                     return this.instance
              this.instance = new ProjectState();
              return this.instance;
       }

       addProject = (title: string, description: string, people: number) => {
              const existingProject = this.projects.find(proj => proj.title === title)
              if(existingProject)
                     return alertGenerator("Please add a project with different title!", "error")
              const newProject = new Project(
                     this.projects.length+1,
                     title,
                     description,
                     people,
                     ProjectStatus.Active
              )
              this.projects.push(newProject);
              for(const listenerFn of this.listeners) {
                     listenerFn(this.projects.slice())
              }
              alertGenerator("Congratulations! Project added successfully.", "success")
       }

       moveProject = (projectId: number, newStatus: ProjectStatus) => {
              const project = this.projects.find(prj => prj.id === projectId)
              
              if(project) {
                     project.status = newStatus;
                     for(const listenerFn of this.listeners) {
                            listenerFn(this.projects.slice())
                     }
              }
       }

       addListner = (listnerFn: Listner) => {
              this.listeners.push(listnerFn);
       }
}

const projectState = ProjectState.getInstance();

interface Draggable {
       //handleDragStart(event: Event): void;
       handleDragEnd(event: Event): void;
}

interface DragTarget {
       handleDragOver(event: Event): void;
       handleDrop(event: Event): void;
       handleDragLeave(event: Event): void;
}

interface Validatable {
       fieldName: string,
       value: string | number,
       minLength?: number,
       maxLength?: number,
       min?: number,
       max?: number
}

const validate = (input: Validatable) => {
       if(input.value.toString().trim()!=="") {
              if(input.minLength && input.minLength>input.value.toString().trim().length) {
                     alertGenerator("Please add a "+input.fieldName+" of length more than 5", "error")
                     return false
              }
              if(input.maxLength && input.maxLength<input.value.toString().trim().length) {
                     alertGenerator(input.fieldName +" length can't be more than "+input.maxLength+" letters!", "error")
                     return false
              }
              if(input.max && input.value>input.max) {
                     alertGenerator(input.fieldName +" can't be more than "+input.max+"!", "error")
                     return false
              }
              if(input.min && input.value<input.min) {
                     alertGenerator(input.fieldName +" length can't be less than "+input.min+"!", "error")
                     return false
              }
              return true
       } else {
              alertGenerator("Please add a "+input.fieldName+"!", "error")
              return false
       }
}

const alertGenerator = (text: string, type: string) => {
       if(type==="error") {
              document.getElementById("alert")!.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">`+text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       } else {
              document.getElementById("alert")!.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">`+text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       }
}

function autoBind(_: any, _2: string, descriptor: PropertyDescriptor): any  {
       const method = descriptor.value;
       const ajtDescriptor: PropertyDescriptor = {
              configurable: true,
              get() {
                     const bound = method.bind(this)
                     return bound;
              }
       } 
       return ajtDescriptor;
}

class ProjectList implements Draggable, DragTarget {
       template: HTMLTemplateElement;
       hostDiv: HTMLDivElement;
       formElement: HTMLElement;
       activeProjects: Project[];

       constructor(private type: "active" | "finished") {
              this.template = document.getElementById("project-list")! as HTMLTemplateElement;
              this.hostDiv = document.getElementById("app")! as HTMLDivElement;

              const importedNode = document.importNode(this.template.content, true);
              this.formElement = importedNode.firstElementChild as HTMLElement;
              this.formElement.id = `${this.type}-projects`

              this.activeProjects = []

              projectState.addListner((projects: Project[]) => {
                     const sortedProjects = projects.filter((prj) => {
                            if(this.type==="active")
                                   return prj.status===ProjectStatus.Active
                            else
                                   return prj.status===ProjectStatus.Finished
                     })
                     this.activeProjects = sortedProjects;
                     this.renderProjects()
              })
              
              this.attach();
              this.renderContent();
       }

       private renderProjects = () => {
              const list = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement
              list.innerHTML = `<div class="accordion accordion-flush" id="${this.type}-accordion"></div>`;
              const accordion = document.getElementById(`${this.type}-accordion`)! as HTMLUListElement
              for (const project of this.activeProjects) {
                     const projItem = document.createElement("li");
                     projItem.innerHTML= `<div class="accordion-item" draggable="true" id="${project.id}">
                            <h2 class="accordion-header" id="headingOne">
                                   <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${"project"+project.id}" aria-expanded="true" aria-controls="collapseOne">
                                          ${project.title}
                                   </button>
                            </h2>
                            <div id="${"project"+project.id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#${this.type}-accordion">
                                   <div class="accordion-body">
                                          <strong>Description: </strong><i>${project.description}</i><br><br>
                                          <strong>Assigned people: </strong><i>${project.people}</i>
                                   </div>
                            </div>
                            </div>`;
                     accordion?.appendChild(projItem)

                     projItem.addEventListener("dragstart", (event) => {this.handleDragStart(event, project.id, project.status)})
                     projItem.addEventListener("dragend", this.handleDragEnd)
              } 

              this.formElement.addEventListener("dragover", this.handleDragOver)
              this.formElement.addEventListener("drop", this.handleDrop)
              this.formElement.addEventListener("dragleave", this.handleDragLeave)
       }

       handleDragStart(event: DragEvent, projectId: number, projectStatus: ProjectStatus) {
              event.dataTransfer!.setData("text/plain", projectId.toString())
              event.dataTransfer!.setData("text/glain", projectStatus.toString())
              event.dataTransfer!.effectAllowed="move";
       }

       handleDragEnd(_: DragEvent) {
              document.getElementById(this.type+"-project-list")!.classList.remove("droppable")
       }

       handleDrop(event: DragEvent) {
              event.preventDefault();
              const status = event.dataTransfer!.getData("text/glain")=="0" ? ProjectStatus.Finished : ProjectStatus.Active
              projectState.moveProject(parseInt(event.dataTransfer!.getData("text/plain")), status)
              document.getElementById(this.type+"-project-list")!.classList.remove("droppable")
       }

       @autoBind
       handleDragOver(event: DragEvent) {
              if(event.dataTransfer && (event.dataTransfer.types[0]==="text/plain" ||  event.dataTransfer.types[0]==="text/glain")) {
                     event.preventDefault()
              }
              document.getElementById(this.type+"-project-list")!.classList.add("droppable")
       }

       @autoBind
       handleDragLeave(_: DragEvent) {
              document.getElementById(this.type+"-project-list")!.classList.remove("droppable")
       }

       private renderContent = () => {
              const listId = `${this.type}-project-list`;
              this.formElement.querySelector("h2")!.textContent = this.type.toUpperCase()+" PROJECTS";
              this.formElement.querySelector("ul")!.id = listId;
       }

       private attach = () => {
              this.hostDiv.insertAdjacentElement("beforeend", this.formElement);
       }
}

class ProjectForm {
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
              if (validate({fieldName: "Title", value: this.titleInput.value, maxLength: 20, minLength: 5}) && 
                     validate({fieldName: "Description", value: this.description.value, maxLength: 20, minLength: 5}) &&
                     validate({fieldName: "People", value: this.people.value, min: 2, max: 10})
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

const projectForm = new ProjectForm();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");