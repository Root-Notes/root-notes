import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Group,
    Image,
    Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../../util/StateManagement";
import { useEffect } from "react";

export function Layout() {
    const { t } = useTranslation();
    const [project] = useProject();
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (project === null && location.pathname !== "/home") {
            nav("/home");
        }
    }, [location.pathname, project]);

    return (
        <AppShell className="app-root" header={{ height: 64 }} padding="md">
            <AppShellHeader className="app-header">
                <Group gap="md" justify="space-between">
                    <Group gap="md" className="app-name">
                        <Image radius="md" className="logo" src="/icon.svg" />
                        <Title order={2}>{t("app.name")}</Title>
                    </Group>
                </Group>
            </AppShellHeader>
            <AppShellMain className="app-content">
                <Outlet />
            </AppShellMain>
        </AppShell>
    );
}
