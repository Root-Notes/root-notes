import { Low } from "lowdb";
import { ReactNode, useCallback, useState } from "react";
import { Project } from "@root-notes/common";
import { DatabaseContext, LocalApiAdapter } from "./util";
import { useFs } from "../LocalApi";

export function DatabaseProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [db, setDb] = useState<Low<Project> | null>(null);
    const fs = useFs();

    const setDatabase = useCallback(
        async (folder: string[] | null) => {
            if (folder) {
                const newDb = new Low<Project>(
                    new LocalApiAdapter(fs, folder),
                    {
                        records: [],
                        manifest: {
                            id: "",
                            name: "",
                            icon: { family: "md", name: "MdDescription" },
                        },
                    }
                );
                await newDb.read();
                setDb(newDb);
            } else {
                if (db) {
                    await db.write();
                }
                setDb(null);
            }
        },
        [setDb]
    );

    return (
        <DatabaseContext.Provider value={{ db, setDb: setDatabase }}>
            {children}
        </DatabaseContext.Provider>
    );
}
