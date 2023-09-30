import { Box } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../../util/Project/util";
import { useEffect } from "react";
import { useConfigState } from "../../util/Config";
import { RootNotesInterface } from "@root-notes/common";

export function Layout() {
    const project = useProject();
    const nav = useNavigate();
    const location = useLocation();
    const loaded = useConfigState();

    useEffect(() => {
        if (project === null && location.pathname !== "/home" && loaded) {
            nav("/home");
        }
    }, [location.pathname, project, loaded]);

    return (
        <Box className="app-content" p="sm">
            <RootNotesInterface project={project} />
        </Box>
    );
}
