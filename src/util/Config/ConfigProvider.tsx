import { ReactNode, useContext, useEffect, useState } from "react";
import { LocalApiContext } from "../LocalApi/util";
import { RootNotesConfig } from "../LocalApi/types";
import { ConfigContext, DEFAULT_CONFIG } from "./util";

export function ConfigProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const api = useContext(LocalApiContext);
    const [config, setConfig] = useState<RootNotesConfig>(DEFAULT_CONFIG);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (api) {
            api.config.get().then((result) => {
                if (result.success) {
                    setConfig(result.value);
                    setLoaded(true);
                }
            });
        }
    }, [api?.config]);

    return (
        <ConfigContext.Provider
            value={{
                config,
                setConfig: (_conf) => {
                    if (api) {
                        api.config.set(_conf);
                    }
                    setConfig(_conf);
                },
                configLoaded: loaded,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}
