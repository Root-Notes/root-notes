import { Buffer } from "buffer/";

export type IpcResult<T> =
    | {
          success: true;
          value: T;
      }
    | {
          success: false;
          errorCode: string;
      };

export type LocalApiFunctionType<TArgs extends any[], TReturn> = (
    ...args: TArgs
) => Promise<IpcResult<TReturn>>;

export type FileFilter = {
    extensions: string[];
    name: string;
};

export type OpenFileType = Partial<{
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

export type OpenFileReturnType = {
    canceled: boolean;
    filePaths: string[];
};

export type SaveFileType = Partial<{
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

export type SaveFileReturnType = {
    canceled: boolean;
    filePath?: string | undefined;
};

export type RootNotesConfig = {
    recentProjects: {
        name: string;
        id: string;
        icon: { name: string; family: string };
        folder: string[];
    }[];
    currentProject: string[] | null;
};

export type LocalApi = {
    fs: {
        exists: LocalApiFunctionType<[path: string[]], boolean>;
        readdir: LocalApiFunctionType<[directory: string[]], string[]>;
        mkdir: LocalApiFunctionType<
            [path: string[], recursive?: boolean],
            string | undefined
        >;
        readFile: {
            text: LocalApiFunctionType<[path: string[]], string>;
            raw: LocalApiFunctionType<[path: string[]], Buffer>;
            rawDataUrl: LocalApiFunctionType<
                [path: string[], mime: string],
                string
            >;
        };
        writeFile: {
            text: LocalApiFunctionType<[path: string[], data: string], void>;
            raw: LocalApiFunctionType<[path: string[], data: Buffer], void>;
            rawDataUrl: LocalApiFunctionType<
                [path: string[], data: string],
                void
            >;
        };
    };
    dialog: {
        open: LocalApiFunctionType<[options: OpenFileType], OpenFileReturnType>;
        save: LocalApiFunctionType<[options: SaveFileType], SaveFileReturnType>;
    };
    config: {
        get: LocalApiFunctionType<[], RootNotesConfig>;
        set: LocalApiFunctionType<[config: RootNotesConfig], void>;
    };
};
