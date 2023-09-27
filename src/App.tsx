/// <reference types="vite-plugin-svgr/client" />

import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routing";
import { themeDefault } from "./theme/default";
import "./sass/index.scss";
import { LocalApiProvider } from "./util/LocalApi";
import { DatabaseProvider } from "./util/Database";
import { ModalsProvider } from "@mantine/modals";
import { MODALS } from "./components/modals";
import { Notifications } from "@mantine/notifications";
import { ProjectProvider } from "./util/Project/ProjectProvider";

export function App() {
    return (
        <LocalApiProvider>
            <DatabaseProvider>
                <ProjectProvider>
                    <MantineProvider
                        defaultColorScheme="dark"
                        theme={themeDefault}
                    >
                        <Notifications />
                        <ModalsProvider modals={MODALS}>
                            <RouterProvider router={appRouter} />
                        </ModalsProvider>
                    </MantineProvider>
                </ProjectProvider>
            </DatabaseProvider>
        </LocalApiProvider>
    );
}
