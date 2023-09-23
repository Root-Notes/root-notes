import { createContext, useContext } from "react";
import { LocalApi, IpcResult, LocalApiFunctionType } from "./types";

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
