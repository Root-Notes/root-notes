import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { MODALS } from "../../components/modals";
import { themeDefault } from "../../theme/default";
import { LocalApiProvider } from "../LocalApi";
import { Outlet } from "react-router-dom";
import { EventProvider } from "@root-notes/common";
import { ConfigProvider } from "../Config";
import { ProjectContextProvider } from "../Project/ProjectProvider";

export function InternalProviders() {
    return (
        <EventProvider>
            <LocalApiProvider>
                <ConfigProvider>
                    <ProjectContextProvider>
                        <MantineProvider
                            defaultColorScheme="dark"
                            theme={themeDefault}
                        >
                            <Notifications />
                            <ModalsProvider modals={MODALS}>
                                <Outlet />
                            </ModalsProvider>
                        </MantineProvider>
                    </ProjectContextProvider>
                </ConfigProvider>
            </LocalApiProvider>
        </EventProvider>
    );
}
