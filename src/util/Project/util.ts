import { Low } from "lowdb";
import { ActiveProjectContextType, Project } from "@root-notes/common";
import { createContext } from "react";

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
