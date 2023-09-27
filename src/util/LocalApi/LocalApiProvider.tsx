import { ReactNode, useMemo } from "react";
import { LocalApi, OpenFileType, RootNotesConfig, SaveFileType } from "./types";
import { LocalApiContext, wrapSuccessful } from "./util";
import { Buffer } from "buffer/";
export function LocalApiProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const api = (window as any).api;

    const resolvedApi: LocalApi = useMemo(
        () => ({
            fs: {
                exists: async (path: string[]) => await api.fs.exists(path),
                readdir: async (directory: string[]) =>
                    await api.fs.readdir(directory),
                mkdir: async (path: string[], recursive?: boolean) =>
                    await api.fs.mkdir(path, recursive),
                readFile: {
                    text: async (path: string[]) =>
                        await api.fs.readFile.text(path),
                    raw: wrapSuccessful(
                        async (path: string[]) =>
                            await api.fs.readFile.raw(path),
                        (value) => Buffer.from(value, "base64")
                    ),
                    rawDataUrl: wrapSuccessful(
                        async (path: string[]) =>
                            await api.fs.readFile.raw(path),
                        (value: string, _: string, mime: string) =>
                            "data:" +
                            mime +
                            ";base64," +
                            Buffer.from(value, "base64").toString("base64")
                    ),
                },
                writeFile: {
                    text: async (path: string[], data: string) =>
                        await api.fs.writeFile.text(path, data),
                    raw: async (path: string[], data: Buffer) =>
                        await api.fs.writeFile.raw(
                            path,
                            data.toString("base64")
                        ),
                    rawDataUrl: async (path: string[], data: string) =>
                        await api.fs.writeFile.raw(
                            path,
                            Buffer.from(
                                data.split(",", 2)[1],
                                "base64"
                            ).toString("base64")
                        ),
                },
            },
            dialog: {
                open: async (options: OpenFileType) =>
                    await api.dialog.open(options),
                save: async (options: SaveFileType) =>
                    await api.dialog.save(options),
            },
            config: {
                get: async () => await api.config.get(),
                set: async (config: RootNotesConfig) =>
                    await api.config.set(config)
            },
        }),
        []
    );

    return (
        <LocalApiContext.Provider value={resolvedApi}>
            {children}
        </LocalApiContext.Provider>
    );
}
