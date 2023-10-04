import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { MODALS } from "../../components/modals";
import { themeDefault } from "../../theme/default";
import { LocalApiProvider } from "../LocalApi";
import { Outlet } from "react-router-dom";
import { EventProvider } from "@root-notes/common";
import { ConfigProvider } from "../Config";

export function InternalProviders() {
    return (
        <EventProvider>
            <LocalApiProvider>
                <ConfigProvider>
                    <MantineProvider
                        defaultColorScheme="dark"
                        theme={themeDefault}
                    >
                        <Notifications />
                        <ModalsProvider modals={MODALS}>
                            <Outlet />
                        </ModalsProvider>
                    </MantineProvider>
                </ConfigProvider>
            </LocalApiProvider>
        </EventProvider>
    );
}
