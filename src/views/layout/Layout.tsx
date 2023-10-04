import { Box } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useConfigState } from "../../util/Config";

export function Layout() {
    const project = null;
    const nav = useNavigate();
    const location = useLocation();
    const loaded = useConfigState();

    useEffect(() => {
        if (project === null && location.pathname !== "/home" && loaded) {
            nav("/home");
        }
    }, [location.pathname, project, loaded]);

    return <Box className="app-content" p="sm"></Box>;
}
