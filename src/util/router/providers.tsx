import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { MODALS } from "../../components/modals";
import { themeDefault } from "../../theme/default";
import { DatabaseProvider } from "../Database";
import { LocalApiProvider } from "../LocalApi";
import { ProjectProvider } from "../Project/ProjectProvider";
import { Outlet } from "react-router-dom";
import { EventProvider } from "@root-notes/common";
import { ConfigProvider } from "../Config";

export function InternalProviders() {
    return (
        <EventProvider>
            <LocalApiProvider>
                <ConfigProvider>
                    <DatabaseProvider>
                        <ProjectProvider>
                            <MantineProvider
                                defaultColorScheme="dark"
                                theme={themeDefault}
                            >
                                <Notifications />
                                <ModalsProvider modals={MODALS}>
                                    <Outlet />
                                </ModalsProvider>
                            </MantineProvider>
                        </ProjectProvider>
                    </DatabaseProvider>
                </ConfigProvider>
            </LocalApiProvider>
        </EventProvider>
    );
}
