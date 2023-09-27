import { Low } from "lowdb";
import { createContext, useContext } from "react";
import { LocalApi } from "../LocalApi";
import { Project } from "@root-notes/common";

export type DatabaseContextType = {
    db: null | Low<Project>;
    setDb: (folder: string[] | null) => Promise<null | Low<Project>>;
};

export const DatabaseContext = createContext<DatabaseContextType>({
    db: null,
    setDb: async () => null,
});

export function useDb(): [
    null | Low<Project>,
    setDb: (folder: string[] | null) => Promise<null | Low<Project>>
] {
    const context = useContext(DatabaseContext);
    return [context.db, context.setDb];
}

export class LocalApiAdapter {
    constructor(private api: LocalApi["fs"], private folder: string[]) {}

    public async read() {
        const result = await this.api.readFile.text([
            ...this.folder,
            "root.json",
        ]);
        if (result.success) {
            return JSON.parse(result.value);
        } else {
            throw new Error();
        }
    }

    public async write(data: any) {
        await this.api.writeFile.text(
            [...this.folder, "root.json"],
            JSON.stringify(data)
        );
    }
}
