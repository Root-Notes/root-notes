import { Low } from "lowdb";
import {
    ActiveProjectContextType,
    Project,
    ProjectInterface,
} from "@root-notes/common";
import { createContext, useContext } from "react";

export type ProjectContextType =
    | {
          activateProject: (path: string[]) => Promise<boolean>;
          active: false;
      }
    | (ActiveProjectContextType & {
          folder: string[];
          database: Low<Project>;
      });

export const ProjectContext = createContext<ProjectContextType>({
    active: false,
    activateProject: async () => false,
});

export function useProject(): ProjectInterface | null {
    const context = useContext(ProjectContext);
    return context.active ? context.interface : null;
}

export function useActivateProject(): (path: string[]) => Promise<boolean> {
    const context = useContext(ProjectContext);
    return context.active ? async () => false : context.activateProject;
}
