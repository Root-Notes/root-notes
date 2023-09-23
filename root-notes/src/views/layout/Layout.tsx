import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Group,
    Image,
    Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

export function Layout() {
    const { t } = useTranslation();
    return (
        <AppShell className="app-root" header={{ height: 64 }} padding="md">
            <AppShellHeader className="app-header">
                <Group gap="md" justify="space-between">
                    <Group gap="md" className="app-name">
                        <Image radius="md" className="logo" src="/icon.svg" />
                        <Text size="xl">{t("app.name")}</Text>
                    </Group>
                </Group>
            </AppShellHeader>
            <AppShellMain className="app-content"></AppShellMain>
        </AppShell>
    );
}
