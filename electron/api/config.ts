import { ipcMain } from "electron";
import { wrapHandler } from "./util";
import { app } from "electron";
import { existsSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

export function registerConfigFunctions() {
    ipcMain.handle("config.get", wrapHandler(getConfig));
    ipcMain.handle("config.set", wrapHandler(setConfig));
}

type RootNotesConfig = {
    recentProjects: {
        name: string;
        id: string;
        icon: { name: string; family: string };
        folder: string[];
    }[];
};

const DEFAULT_CONFIG = {
    recentProjects: [],
};

async function getConfig(): Promise<RootNotesConfig> {
    const configPath = app.getPath("userData");
    if (!existsSync(join(configPath, "settings.json"))) {
        await writeFile(
            join(configPath, "settings.json"),
            JSON.stringify(DEFAULT_CONFIG),
            { encoding: "utf-8" }
        );
    }
    return JSON.parse(
        await readFile(join(configPath, "settings.json"), { encoding: "utf-8" })
    );
}

async function setConfig(newConfig: RootNotesConfig): Promise<void> {
    const configPath = app.getPath("userData");
    await writeFile(
        join(configPath, "settings.json"),
        JSON.stringify(newConfig),
        { encoding: "utf-8" }
    );
}
