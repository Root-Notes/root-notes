import { IpcMainInvokeEvent } from "electron";

export type IpcResult<T> =
    | {
          success: true;
          value: T;
      }
    | {
          success: false;
          errorCode: string;
      };

export type IpcError = {
    code: string;
};

function isIpcError(obj: any): obj is IpcError {
    return (
        obj &&
        Object.keys(obj).length === 1 &&
        obj.code &&
        typeof obj.code === "string"
    );
}

export function wrapHandler<T>(
    handler: (...args: any[]) => Promise<T>
): (
    event: IpcMainInvokeEvent,
    ...args: any[]
) => Promise<IpcResult<Exclude<T, IpcError>>> {
    return (async (_: IpcMainInvokeEvent, ...args: any[]) => {
        try {
            const result = await handler(...args);
            if (isIpcError(result)) {
                return {
                    success: false,
                    errorCode: result.code,
                };
            } else {
                return {
                    success: true,
                    value: result,
                };
            }
        } catch (e) {
            console.error(e);
            return {
                success: false,
                errorCode: "unknown",
            };
        }
    }) as any;
}
