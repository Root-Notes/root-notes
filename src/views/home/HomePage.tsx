import { Button, Image, Paper, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFolderOpen } from "react-icons/md";

export function HomePage() {
    const { t } = useTranslation();
    return (
        <Paper p="lg" radius="md" className="home-page-main" withBorder>
            <Stack align="center" gap="md">
                <Image src="/icon.svg" className="app-icon" />
                <Button leftSection={<MdAdd />} fullWidth>
                    {t("views.home.buttons.create")}
                </Button>
                <Button leftSection={<MdFolderOpen />} fullWidth>
                    {t("views.home.buttons.open")}
                </Button>
            </Stack>
        </Paper>
    );
}
