import { Low } from "lowdb";
import { Project, ProjectManifest } from "@root-notes/common";

export type ActiveProject = {
    database: Low<Project>;
    manifest: ProjectManifest;
    rootPath: string[];
};

export type ProjectContextType =
    | {
          activateProject: (path: string[]) => Promise<ActiveProject | null>;
          project: null;
      }
    | {
          project: ActiveProject;
      };
