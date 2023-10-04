import { Box } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useConfigState } from "../../util/Config";
import { useProject } from "../../util/Project/util";
import { RootProvider } from "@root-notes/common";
import { useFs } from "../../util/LocalApi";
import { LocalSyncFactoryFactory } from "../../util/LocalSync/LocalSync";

export function Layout() {
    const { project } = useProject();
    const nav = useNavigate();
    const location = useLocation();
    const loaded = useConfigState();
    const fs = useFs();

    useEffect(() => {
        if (project === null && location.pathname !== "/home" && loaded) {
            nav("/home");
        }
    }, [location.pathname, project, loaded]);

    return (
        <Box className="app-content" p="sm">
            <RootProvider
                descriptor={project}
                syncFactories={{ local: LocalSyncFactoryFactory(fs) }}
            />
        </Box>
    );
}
