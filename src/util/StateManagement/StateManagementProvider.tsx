import { ReactNode, useState } from "react";
import { ProjectManifest } from "../../types/project";
import { StateManagementContext } from "./additional";

export function StateManagementProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [project, setProject] = useState<ProjectManifest | null>(null);

    return (
        <StateManagementContext.Provider
            value={{
                project: { manifest: project, setProject: async () => null },
            }}
        >
            {children}
        </StateManagementContext.Provider>
    );
}
