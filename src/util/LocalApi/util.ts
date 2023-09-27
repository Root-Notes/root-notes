import { createContext, useContext, useEffect, useState } from "react";
import {
    LocalApi,
    IpcResult,
    LocalApiFunctionType,
    RootNotesConfig,
} from "./types";

export const LocalApiContext = createContext<LocalApi>(null as any);

export function wrapSuccessful<T>(
    request: (...args: any[]) => Promise<IpcResult<T>>,
    onSuccess: (value: any, ...args: any[]) => T
): (...args: any[]) => Promise<IpcResult<T>> {
    return async (...args: any[]) => {
        const result = await request(...args);
        if (result.success) {
            return {
                success: true,
                value: onSuccess(result.value, ...args),
            };
        } else {
            return result;
        }
    };
}

function dummyFunction(): LocalApiFunctionType<any[], any> {
    return () =>
        new Promise((resolve) =>
            resolve({ success: false, errorCode: "api.inactive" })
        );
}

export function useFs(): LocalApi["fs"] {
    const api = useContext(LocalApiContext);
    if (api) {
        return api.fs;
    } else {
        return {
            exists: dummyFunction(),
            readdir: dummyFunction(),
            mkdir: dummyFunction(),
            readFile: {
                text: dummyFunction(),
                raw: dummyFunction(),
                rawDataUrl: dummyFunction(),
            },
            writeFile: {
                text: dummyFunction(),
                raw: dummyFunction(),
                rawDataUrl: dummyFunction(),
            },
        };
    }
}

export function useDialog(): LocalApi["dialog"] {
    const api = useContext(LocalApiContext);
    if (api) {
        return api.dialog;
    } else {
        return {
            open: dummyFunction(),
            save: dummyFunction(),
        };
    }
}

const DEFAULT_CONFIG = {
    recentProjects: [],
};

export function useConfig(): [
    RootNotesConfig,
    (config: RootNotesConfig) => void
] {
    const api = useContext(LocalApiContext);
    const [config, setConfig] = useState<RootNotesConfig>(DEFAULT_CONFIG);

    useEffect(() => {
        if (api) {
            api.config
                .get()
                .then((result) => result.success && setConfig(result.value));
        }
    }, []);

    return [
        config,
        (_config: RootNotesConfig) => {
            setConfig(_config);
            if (api) {
                api.config.set(_config);
            }
        },
    ];
}
