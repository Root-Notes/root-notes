import { ReactNode, useState } from "react";
import { ProjectDescriptor } from "@root-notes/common";
import { ProjectContext } from "./util";

export function ProjectContextProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [project, setProject] = useState<ProjectDescriptor | null>(null);
    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
}
