import { Project } from "./Project.js";
import {Draggable, DragTarget} from "../interfaces/DragInterfaces.js";
import { ProjectStatus } from "../ProjectStatus.js";
import { ProjectState } from "./ProjectState.js";
import { autoBind } from "../decorators/autoBind.js";

const projectState = ProjectState.getInstance();

export class ProjectList implements Draggable, DragTarget {
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