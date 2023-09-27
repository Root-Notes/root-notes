import { ReactNode, useMemo, useState } from "react";
import { useDb } from "../Database";
import { ProjectContext } from "./util";
import { useFs } from "../LocalApi";
import { ProjectManifest, Record } from "@root-notes/common";

export function ProjectProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [db, setDb] = useDb();
    const [folder, setFolder] = useState<string[]>([]);
    const fs = useFs();

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

    return (
        <ProjectContext.Provider
            value={
                !db
                    ? {
                          active: false,
                          activateProject: async (path: string[]) => {
                              const folderExists = await fs.exists(path);
                              const rootExists = await fs.exists([
                                  ...path,
                                  "root.json",
                              ]);
                              if (
                                  !(folderExists.success
                                      ? folderExists.value
                                      : false) ||
                                  !(rootExists.success
                                      ? rootExists.value
                                      : false)
                              ) {
                                  return false;
                              }

                              await setDb(null);
                              await setDb(path);
                              setFolder(path);
                              return true;
                          },
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
                              },
                          },
                      }
            }
        >
            {children}
        </ProjectContext.Provider>
    );
}
