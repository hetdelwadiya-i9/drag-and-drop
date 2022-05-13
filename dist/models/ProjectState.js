var _a;
import { ProjectStatus } from "../ProjectStatus.js";
import { alertGenerator } from "../utils/alert.js";
import { Project } from "./Project.js";
export class ProjectState {
    constructor() {
        this.projects = [];
        this.listeners = [];
        this.addProject = (title, description, people) => {
            const existingProject = this.projects.find(proj => proj.title === title);
            if (existingProject)
                return alertGenerator("Please add a project with different title!", "error");
            const newProject = new Project(this.projects.length + 1, title, description, people, ProjectStatus.Active);
            this.projects.push(newProject);
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
            alertGenerator("Congratulations! Project added successfully.", "success");
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
//# sourceMappingURL=ProjectState.js.map