import { createContext, useContext } from "react";
import { RootNotesConfig } from "../LocalApi/types";

export const DEFAULT_CONFIG: RootNotesConfig = {
    recentProjects: [],
    currentProject: false,
};

export type ConfigContextType = {
    config: RootNotesConfig;
    setConfig: (config: RootNotesConfig) => void;
    configLoaded: boolean;
};

export const ConfigContext = createContext<ConfigContextType>({
    config: DEFAULT_CONFIG,
    setConfig: () => {},
    configLoaded: false,
});

export function useConfig(): [
    RootNotesConfig,
    (config: RootNotesConfig) => void
] {
    const conf = useContext(ConfigContext);
    return [conf.config, conf.setConfig];
}

export function useConfigState(): boolean {
    const conf = useContext(ConfigContext);
    return conf.configLoaded;
}
