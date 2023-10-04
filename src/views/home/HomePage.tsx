import {
    ActionIcon,
    Button,
    Fieldset,
    Group,
    Paper,
    Space,
    Stack,
    Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFilterNone, MdOpenInNew } from "react-icons/md";
import AppLogo from "../../assets/icon.svg?react";
import { useOpenModals } from "../../components/modals";
import { useConfig } from "../../util/Config";
import { GenericIcon, ManifestRecord } from "@root-notes/common";
import { PathInput } from "../../components/form/PathInput";
import { useState } from "react";
import { LocalSyncProvider } from "../../util/LocalSync/LocalSync";
import { useFs } from "../../util/LocalApi";
import { useProject } from "../../util/Project/util";
import { useNavigate } from "react-router-dom";

export function HomePage() {
    const { t } = useTranslation();
    const { createProject } = useOpenModals();
    const [config] = useConfig();
    const [openPath, setOpenPath] = useState<string>("");
    const fs = useFs();
    const { setProject } = useProject();
    const nav = useNavigate();
    return (
        <Paper p="lg" radius="md" className="home-page-main" withBorder>
            <Stack align="center" gap="md">
                <AppLogo className="app-icon" />
                <Button
                    leftSection={<MdAdd size={18} />}
                    rightSection={<Space w="md" />}
                    fullWidth
                    onClick={() => createProject()}
                    justify="space-between"
                >
                    {t("views.home.newButton")}
                </Button>
                <Fieldset
                    legend={t("views.home.recent.title")}
                    p="xs"
                    w="100%"
                    className="recent-projects"
                >
                    {config.recentProjects.length > 0 ? (
                        <Stack gap="sm" className="recent-list">
                            {config.recentProjects.map((p) => (
                                <Button
                                    justify="space-between"
                                    fullWidth
                                    rightSection={<MdOpenInNew size={18} />}
                                    leftSection={
                                        <GenericIcon
                                            family={p.icon.family as any}
                                            name={p.icon.name}
                                            size={18}
                                        />
                                    }
                                    variant="subtle"
                                    className="recent-item"
                                    key={p.id}
                                    onClick={() => {}}
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </Stack>
                    ) : (
                        <Group
                            justify="space-between"
                            gap="sm"
                            className="no-recents"
                        >
                            <MdFilterNone size={18} />
                            <Text size="md" className="no-recents-text">
                                {t("views.home.recent.noRecents")}
                            </Text>
                        </Group>
                    )}
                </Fieldset>
                <Group gap="sm" className="folder-open-input">
                    <PathInput
                        value={openPath}
                        onChange={setOpenPath}
                        label={t("views.home.recent.filePath")}
                        mode="directory"
                    />
                    <ActionIcon
                        className="open-folder"
                        size={36}
                        disabled={openPath.length === 0}
                        onClick={() =>
                            LocalSyncProvider.load([openPath], fs).then(
                                (result) => {
                                    console.log(result, openPath);
                                    if (result) {
                                        const _id = (
                                            result.filter(
                                                (r) => r.id === "manifest"
                                            )[0] as ManifestRecord
                                        ).settings.id;
                                        setProject({
                                            id: _id,
                                            entrypoint: () => result,
                                            onClose: () => setProject(null),
                                        });
                                        nav("/");
                                    }
                                }
                            )
                        }
                    >
                        <MdOpenInNew />
                    </ActionIcon>
                </Group>
            </Stack>
        </Paper>
    );
}
