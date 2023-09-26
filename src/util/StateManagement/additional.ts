import { createContext, useContext } from "react";
import { ProjectManifest } from "@root-notes/common";

export type StateManagementContextType = {
    project: {
        manifest: ProjectManifest | null;
        setProject: (folder: string) => Promise<ProjectManifest | null>;
    };
};

export const StateManagementContext = createContext<StateManagementContextType>(
    null as any
);

export function useProject(): [
    null | ProjectManifest,
    (folder: string) => Promise<ProjectManifest | null>
] {
    const context = useContext(StateManagementContext);
    if (context) {
        return [context.project.manifest, context.project.setProject];
    } else {
        return [null, async () => null];
    }
}
