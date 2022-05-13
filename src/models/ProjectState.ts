import { ProjectStatus } from "../ProjectStatus.js";
import { alertGenerator } from "../utils/alert.js";
import { Project } from "./Project.js";

type Listner = (items: Project[]) => void;

export class ProjectState {
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