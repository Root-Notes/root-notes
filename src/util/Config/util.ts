import { createContext, useContext } from "react";
import { RootNotesConfig } from "../LocalApi/types";
import { isFunction } from "lodash";

export const DEFAULT_CONFIG: RootNotesConfig = {
    recentProjects: [],
    currentProject: false,
};

export type ConfigContextType = {
    config: RootNotesConfig;
    setConfig: (config: RootNotesConfig) => void;
    updateConfig: (
        action: (config: RootNotesConfig) => RootNotesConfig
    ) => void;
    configLoaded: boolean;
};

export const ConfigContext = createContext<ConfigContextType>({
    config: DEFAULT_CONFIG,
    setConfig: () => {},
    updateConfig: () => {},
    configLoaded: false,
});

export function useConfig(): [
    RootNotesConfig,
    (
        config: RootNotesConfig | ((config: RootNotesConfig) => RootNotesConfig)
    ) => void
] {
    const conf = useContext(ConfigContext);
    return [
        conf.config,
        (config) => {
            if (isFunction(config)) {
                conf.updateConfig(config);
            } else {
                conf.setConfig(config);
            }
        },
    ];
}

export function useConfigState(): boolean {
    const conf = useContext(ConfigContext);
    return conf.configLoaded;
}
