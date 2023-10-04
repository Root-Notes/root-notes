import { ProjectDescriptor } from "@root-notes/common";
import { createContext, useContext } from "react";

export type ProjectContextType = {
    project: ProjectDescriptor | null;
    setProject: (project: ProjectDescriptor | null) => void;
};

export const ProjectContext = createContext<ProjectContextType>({
    project: null,
    setProject: () => null,
});

export function useProject(): ProjectContextType {
    return useContext(ProjectContext);
}
