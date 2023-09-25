import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routing";
import { themeDefault } from "./theme/default";
import "./sass/index.scss";
import { StateManagementProvider } from "./util/StateManagement";
import { LocalApiProvider } from "./util/LocalApi";
import { DatabaseProvider } from "./util/Database";

export function App() {
    return (
        <LocalApiProvider>
            <DatabaseProvider>
                <StateManagementProvider>
                    <MantineProvider
                        defaultColorScheme="dark"
                        theme={themeDefault}
                    >
                        <RouterProvider router={appRouter} />
                    </MantineProvider>
                </StateManagementProvider>
            </DatabaseProvider>
        </LocalApiProvider>
    );
}
