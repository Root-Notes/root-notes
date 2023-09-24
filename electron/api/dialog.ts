import { FileFilter, ipcMain, dialog } from "electron";
import { IpcError, wrapHandler } from "./util";

export function registerDialogFunctions() {
    ipcMain.handle("dialog.open", wrapHandler(dialogOpenHandler));
    ipcMain.handle("dialog.save", wrapHandler(dialogSaveHandler));
}

type OpenFileType = Partial<{
    title: string;
    defaultPath: string;
    buttonLabel: string;
    filters: FileFilter[];
    properties: (
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "showHiddenFiles"
        | "createDirectory"
        | "promptToCreate"
        | "dontAddToRecent"
    )[];
}>;

type OpenFileReturnType = {
    canceled: boolean;
    filePaths: string[];
};

async function dialogOpenHandler(
    options: OpenFileType
): Promise<OpenFileReturnType | IpcError> {
    try {
        return await dialog.showOpenDialog(options);
    } catch (e) {
        return {
            code: "dialog.openFailure",
        };
    }
}

type SaveFileType = Partial<{
    title: string;
    defaultPath: string;
    buttonLabel: string;
    filters: FileFilter[];
    properties: (
        | "showHiddenFiles"
        | "createDirectory"
        | "showOverwriteConfirmation"
        | "dontAddToRecent"
    )[];
}>;

type SaveFileReturnType = {
    canceled: boolean;
    filePath?: string | undefined;
};

async function dialogSaveHandler(
    options: SaveFileType
): Promise<SaveFileReturnType | IpcError> {
    try {
        return await dialog.showSaveDialog(options);
    } catch (e) {
        return {
            code: "dialog.saveFailure",
        };
    }
}
