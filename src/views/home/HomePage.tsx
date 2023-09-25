import { Button, Paper, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFolderOpen } from "react-icons/md";
import { IconPicker } from "../../components/icons/IconPicker";
import AppLogo from "../../assets/icon.svg?react";

export function HomePage() {
    const { t } = useTranslation();
    return (
        <Paper p="lg" radius="md" className="home-page-main" withBorder>
            <Stack align="center" gap="md">
                <AppLogo className="app-icon" />
                <Button leftSection={<MdAdd />} fullWidth>
                    {t("views.home.buttons.create")}
                </Button>
                <Button leftSection={<MdFolderOpen />} fullWidth>
                    {t("views.home.buttons.open")}
                </Button>
                <IconPicker />
            </Stack>
        </Paper>
    );
}
