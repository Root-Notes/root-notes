import { Button, Paper, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFolderOpen } from "react-icons/md";
import AppLogo from "../../assets/icon.svg?react";
import { useOpenModals } from "../../components/modals";

export function HomePage() {
    const { t } = useTranslation();
    const { createProject } = useOpenModals();
    return (
        <Paper p="lg" radius="md" className="home-page-main" withBorder>
            <Stack align="center" gap="md">
                <AppLogo className="app-icon" />
                <Button
                    leftSection={<MdAdd />}
                    fullWidth
                    onClick={() => createProject()}
                >
                    {t("views.home.buttons.create")}
                </Button>
                <Button leftSection={<MdFolderOpen />} fullWidth>
                    {t("views.home.buttons.open")}
                </Button>
            </Stack>
        </Paper>
    );
}
