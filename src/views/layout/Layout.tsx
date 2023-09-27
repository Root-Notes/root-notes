import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Group,
    Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../../util/Project/util";
import { useEffect } from "react";
import AppLogo from "../../assets/icon.svg?react";

export function Layout() {
    const { t } = useTranslation();
    const project = useProject();
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
                        <AppLogo className="logo" />
                        <Title order={2}>{t("common.app.name")}</Title>
                    </Group>
                </Group>
            </AppShellHeader>
            <AppShellMain className="app-content">
                <Outlet />
            </AppShellMain>
        </AppShell>
    );
}
