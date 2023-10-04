import {
    AtomicEdit,
    IconRepresentation,
    ManifestRecord,
    Records,
    SyncInfo,
    SyncProvider,
    SyncRecord,
} from "@root-notes/common";
import { v4 } from "uuid";
import { unset, snakeCase } from "lodash";
import { LocalApi } from "../LocalApi";

export type LocalSyncArgs = {
    folder: string[];
};

export class LocalSyncProvider implements SyncProvider {
    public listeners: { [key: string]: (edit: AtomicEdit) => void };
    public processedEdits: string[];
    private registry: { [key: string]: string };
    public constructor(
        public meta: SyncInfo<LocalSyncArgs>,
        private fs: LocalApi["fs"]
    ) {
        this.listeners = {};
        this.processedEdits = [];
        this.registry = null as any;
        this.loadRegistry();
    }

    private path(file: string): string[] {
        return [...this.meta.args.folder, file];
    }

    private async loadRegistry(): Promise<void> {
        const result = await this.fs.readFile.text(this.path("_registry.json"));
        if (result.success) {
            this.registry = JSON.parse(result.value);
        } else {
            await this.fs.writeFile.text(
                this.path("_registry.json"),
                JSON.stringify({ manifest: "manifest.json" })
            );
            this.registry = { manifest: "manifest.json" };
        }
    }

    private async saveRegistry(): Promise<void> {
        await this.fs.writeFile.text(
            this.path("_registry.json"),
            JSON.stringify(this.registry)
        );
    }

    public addListener(listener: (edit: AtomicEdit) => void): string {
        const _id = v4();
        this.listeners[_id] = listener;
        return _id;
    }

    public removeListener(id: string): void {
        unset(this.listeners, id);
    }

    public async edit(
        edit: AtomicEdit<Records>,
        record: Records | null
    ): Promise<void> {
        if (!this.processedEdits.includes(edit.id)) {
            this.processedEdits.push(edit.id);
            if (edit.family === "builtin") {
                switch (edit.command) {
                    case "create":
                        await this.fs.writeFile.text(
                            this.path(edit.data.id + ".record.json"),
                            JSON.stringify(edit.data)
                        );
                        this.registry[edit.data.id] =
                            edit.data.id + ".record.json";
                        await this.saveRegistry();
                        return;
                    case "delete":
                        unset(this.registry, edit.target);
                        await this.saveRegistry();
                        return;
                    case "replace":
                        await this.fs.writeFile.text(
                            this.path(edit.target + ".record.json"),
                            JSON.stringify(edit.data)
                        );
                        return;
                }
            } else {
                if (record) {
                    await this.fs.writeFile.text(
                        this.path(record.id + ".record.json"),
                        JSON.stringify(record)
                    );
                }
            }
        }
    }

    public async get(id: string): Promise<Records | null> {
        if (!this.registry) {
            await this.loadRegistry();
        }
        if (Object.keys(this.registry).includes(id)) {
            const result = await this.fs.readFile.text(
                this.path(this.registry[id])
            );
            if (result.success) {
                return JSON.parse(result.value);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public async getAll(): Promise<Records[]> {
        if (!this.registry) {
            await this.loadRegistry();
        }

        return (
            await Promise.all<Promise<Records>>(
                Object.keys(this.registry).map(async (k) => {
                    const result = await this.fs.readFile.text(
                        this.path(this.registry[k])
                    );
                    if (result.success) {
                        return JSON.parse(result.value);
                    } else {
                        return null;
                    }
                })
            )
        ).filter((v) => Boolean(v));
    }

    public static async load(
        folder: string[],
        fs: LocalApi["fs"]
    ): Promise<Records[] | null> {
        const result = await fs.readFile.text([...folder, "_registry.json"]);
        if (!result.success) {
            return null;
        }

        return (
            await Promise.all(
                Object.values<string>(JSON.parse(result.value)).map(
                    async (v: string) => {
                        const r = await fs.readFile.text([...folder, v]);
                        if (r.success) {
                            return JSON.parse(r.value);
                        } else {
                            return null;
                        }
                    }
                )
            )
        ).filter((v) => Boolean(v));
    }
}

export function LocalSyncFactoryFactory(
    fs: LocalApi["fs"]
): (info: SyncInfo<LocalSyncArgs>) => LocalSyncProvider {
    return (info) => new LocalSyncProvider(info, fs);
}

export function buildLocalProject(
    name: string,
    folder: string[],
    icon: IconRepresentation
): Records[] {
    return [
        ManifestRecord.create({ id: snakeCase(name), meta: { name, icon } }),
        SyncRecord.create<LocalSyncArgs>("local", { folder }),
    ];
}
