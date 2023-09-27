import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useDb } from "../Database";
import { ProjectContext } from "./util";
import { useFs } from "../LocalApi";
import { ProjectManifest, Record } from "@root-notes/common";
import { useConfig } from "../LocalApi/util";
import { useLocation, useNavigate } from "react-router-dom";

export function ProjectProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [db, setDb] = useDb();
    const [folder, setFolder] = useState<string[]>([]);
    const fs = useFs();
    const [config, setConfig] = useConfig();
    const nav = useNavigate();
    const location = useLocation();

    const _manifest: ProjectManifest = useMemo(
        () =>
            db?.data?.manifest ?? {
                name: "",
                id: "",
                icon: { family: "md", name: "MdDescription" },
            },
        [db?.data?.manifest]
    );
    const _records: { [key: string]: Record } = useMemo(
        () =>
            db
                ? db.data.records.reduce(
                      (prev, cur) => ({ ...prev, [cur.id]: cur }),
                      {}
                  )
                : {},
        [db?.data?.records]
    );

    const activate = useCallback(
        async (path: string[]) => {
            const folderExists = await fs.exists(path);
            const rootExists = await fs.exists([...path, "root.json"]);
            if (
                !(folderExists.success ? folderExists.value : false) ||
                !(rootExists.success ? rootExists.value : false)
            ) {
                return false;
            }

            await setDb(null);
            const db = await setDb(path);
            if (db) {
                setConfig({
                    recentProjects: [
                        { ...db.data.manifest, folder: path },
                        ...config.recentProjects.filter(
                            ({ id }) => id !== db.data.manifest.id
                        ),
                    ],
                    currentProject: path,
                });
                setFolder(path);
                return true;
            } else {
                return false;
            }
        },
        [fs]
    );

    useEffect(() => {
        if (config.currentProject && location.pathname === "/home") {
            activate(config.currentProject).then((success) => {
                if (success) {
                    nav("/");
                }
            });
        }
    }, [config.currentProject, location.pathname]);

    useEffect(() => {
        const refreshHandler = (ev: BeforeUnloadEvent) => {
            ev.preventDefault();
            console.log(ev);
            if (db) {
                db.write().then(() => window.location.reload());
            }
        };
        window.addEventListener("beforeunload", refreshHandler);
        return () => window.removeEventListener("beforeunload", refreshHandler);
    }, []);

    return (
        <ProjectContext.Provider
            value={
                !db
                    ? {
                          active: false,
                          activateProject: activate,
                      }
                    : {
                          folder: folder,
                          database: db,
                          active: true,
                          interface: {
                              manifest: _manifest,
                              records: _records,
                              sync: async () => {
                                  await db.write();
                              },
                              close: async () => {
                                  await setDb(null);
                                  setFolder([]);
                                  setConfig({
                                      ...config,
                                      currentProject: null,
                                  });
                              },
                          },
                      }
            }
        >
            {children}
        </ProjectContext.Provider>
    );
}
