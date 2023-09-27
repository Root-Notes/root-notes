/// <reference types="vite-plugin-svgr/client" />

import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routing";
import { themeDefault } from "./theme/default";
import "./sass/index.scss";
import { StateManagementProvider } from "./util/StateManagement";
import { LocalApiProvider } from "./util/LocalApi";
import { DatabaseProvider } from "./util/Database";
import { ModalsProvider } from "@mantine/modals";
import { MODALS } from "./components/modals";
import { Notifications } from "@mantine/notifications";

export function App() {
    return (
        <LocalApiProvider>
            <DatabaseProvider>
                <StateManagementProvider>
                    <MantineProvider
                        defaultColorScheme="dark"
                        theme={themeDefault}
                    >
                        <Notifications />
                        <ModalsProvider modals={MODALS}>
                            <RouterProvider router={appRouter} />
                        </ModalsProvider>
                    </MantineProvider>
                </StateManagementProvider>
            </DatabaseProvider>
        </LocalApiProvider>
    );
}
