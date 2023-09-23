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

export type LocalApi = {
    fs: {
        readdir: LocalApiFunctionType<[directory: string], string[]>;
        mkdir: LocalApiFunctionType<
            [path: string, recursive?: boolean],
            string | undefined
        >;
        readFile: {
            text: LocalApiFunctionType<[path: string], string>;
            raw: LocalApiFunctionType<[path: string], Buffer>;
            rawDataUrl: LocalApiFunctionType<
                [path: string, mime: string],
                string
            >;
        };
        writeFile: {
            text: LocalApiFunctionType<[path: string, data: string], void>;
            raw: LocalApiFunctionType<[path: string, data: Buffer], void>;
            rawDataUrl: LocalApiFunctionType<
                [path: string, data: string],
                void
            >;
        };
    };
};
