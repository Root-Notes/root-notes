import { ipcMain } from "electron";
import { IpcError, wrapHandler } from "./util";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import { Buffer } from "node:buffer";

export function registerFsFunctions() {
    ipcMain.handle("fs.readdir", wrapHandler(fsReaddirHandler));
    ipcMain.handle("fs.mkdir", wrapHandler(fsMkdirHandler));
    ipcMain.handle("fs.readFile.text", wrapHandler(fsReadFileHandler));
    ipcMain.handle("fs.readFile.raw", wrapHandler(fsReadBlobHander));
    ipcMain.handle("fs.writeFile.text", wrapHandler(fsWriteFileHandler));
    ipcMain.handle("fs.writeFile.raw", wrapHandler(fsWriteBlobHander));
}

async function fsReaddirHandler(
    directory: string
): Promise<string[] | IpcError> {
    try {
        return await readdir(directory);
    } catch (e) {
        console.log(e);
        return {
            code: "fs.notExist",
        };
    }
}

async function fsMkdirHandler(
    path: string,
    recursive?: boolean
): Promise<string | undefined | IpcError> {
    try {
        return await mkdir(path, { recursive });
    } catch (e) {
        return {
            code: "fs.generic",
        };
    }
}

async function fsReadFileHandler(path: string): Promise<string | IpcError> {
    try {
        return await readFile(path, { encoding: "utf-8" });
    } catch (e) {
        return {
            code: "fs.notExist",
        };
    }
}

async function fsWriteFileHandler(
    path: string,
    data: string
): Promise<void | IpcError> {
    try {
        return await writeFile(path, data, { encoding: "utf-8" });
    } catch (e) {
        return {
            code: "fs.writeError",
        };
    }
}

async function fsWriteBlobHander(
    path: string,
    data: string
): Promise<void | IpcError> {
    try {
        return await writeFile(path, Buffer.from(data, "base64"));
    } catch (e) {
        return {
            code: "fs.writeError",
        };
    }
}

async function fsReadBlobHander(path: string): Promise<string | IpcError> {
    try {
        return (await readFile(path)).toString("base64");
    } catch (e) {
        return {
            code: "fs.writeError",
        };
    }
}
