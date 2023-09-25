export type ProjectManifest = {
    name: string;
    folder: string;
};

export type Record = (
    | {
          type: "manifest";
          data: ProjectManifest;
      }
    | {
          type: "note";
      }
) & {
    lastRevision: number;
    id: string;
};

export type Project = {
    records: Record[];
};
