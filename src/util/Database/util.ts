import { Low } from "lowdb";
import { createContext, useContext } from "react";
import { LocalApi } from "../LocalApi";
import { join } from "path-browserify";
import { Project } from "@root-notes/common";

export type DatabaseContextType = {
    db: null | Low<Project>;
    setDb: (folder: string | null) => Promise<void>;
};

export const DatabaseContext = createContext<DatabaseContextType>({
    db: null,
    setDb: async () => {},
});

export function useDb(): [
    null | Low<Project>,
    setDb: (folder: string | null) => Promise<void>
] {
    const context = useContext(DatabaseContext);
    return [context.db, context.setDb];
}

export class LocalApiAdapter {
    constructor(private api: LocalApi["fs"], private folder: string) {}

    public async read() {
        const result = await this.api.readFile.text(
            join(this.folder, "db.json")
        );
        if (result.success) {
            return JSON.parse(result.value);
        } else {
            console.error("Failed to read database");
            return { records: [] };
        }
    }

    public async write(data: any) {
        await this.api.writeFile.text(
            join(this.folder, "db.json"),
            JSON.stringify(data)
        );
    }
}
