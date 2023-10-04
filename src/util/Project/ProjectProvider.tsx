import { ReactNode, useCallback, useEffect, useState } from "react";
import {
    ManifestRecord,
    ProjectDescriptor,
    SyncRecord,
} from "@root-notes/common";
import { ProjectContext } from "./util";
import { useConfig, useConfigState } from "../Config";
import { LocalSyncArgs, LocalSyncProvider } from "../LocalSync/LocalSync";
import { useFs } from "../LocalApi";
import { useNavigate } from "react-router-dom";

export function ProjectContextProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [project, setProject] = useState<ProjectDescriptor | null>(null);
    const [config, setConfig] = useConfig();
    const loaded = useConfigState();
    const fs = useFs();
    const nav = useNavigate();

    const extSetProject = useCallback(
        (pr: ProjectDescriptor | null) => {
            if (pr) {
                const records = pr.entrypoint();
                const localSync: SyncRecord<LocalSyncArgs> = records.filter(
                    (r) => r.family === "sync" && r.type === "local"
                )[0] as any;
                const manifest: ManifestRecord = records.filter(
                    (r) => r.id === "manifest"
                )[0] as any;

                if (localSync && manifest) {
                    setConfig({
                        recentProjects: [
                            {
                                name: manifest.settings.meta.name,
                                id: manifest.settings.id,
                                icon: manifest.settings.meta.icon,
                                folder: localSync.info.args.folder,
                            },
                            ...config.recentProjects.filter(
                                (p) => p.id !== manifest.settings.id
                            ),
                        ],
                        currentProject: localSync.info.args.folder,
                    });
                }
            } else {
                setConfig({
                    recentProjects: config.recentProjects,
                    currentProject: false,
                });
            }
            setProject(pr);
        },
        [config, setConfig]
    );

    useEffect(() => {
        console.log(config.currentProject);
        if (loaded && config.currentProject && !project) {
            LocalSyncProvider.load(config.currentProject, fs).then((r) => {
                if (r) {
                    setProject({
                        id: (
                            r.filter(
                                (r) => r.id === "manifest"
                            )[0] as ManifestRecord
                        ).settings.id,
                        entrypoint: () => r,
                        onClose: () => extSetProject(null),
                    });
                    nav("/");
                }
                return;
            });
        }
    }, [loaded, config.currentProject]);

    return (
        <ProjectContext.Provider
            value={{
                project,
                setProject: extSetProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
