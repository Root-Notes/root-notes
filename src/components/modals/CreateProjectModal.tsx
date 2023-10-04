import { Button, Stack, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { IconPicker, IconRepresentation, Records } from "@root-notes/common";
import { PathInput } from "../form/PathInput";
import { useFs } from "../../util/LocalApi";
import { LocalApi } from "../../util/LocalApi";
import { snakeCase, isString } from "lodash";
import { useNotifications } from "../../util/notifications";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../util/Project/util";
import {
    LocalSyncProvider,
    buildLocalProject,
} from "../../util/LocalSync/LocalSync";

async function createProject(
    fs: LocalApi["fs"],
    name: string,
    folder: string,
    icon: IconRepresentation
): Promise<Records[] | string> {
    const mkresult = await fs.mkdir([folder, snakeCase(name)], true);
    if (!mkresult.success) {
        return "errors.project.creation.fs";
    }
    const records = buildLocalProject(name, [folder, snakeCase(name)], icon);
    await LocalSyncProvider.dump([folder, snakeCase(name)], fs, records);
    return records;
}

export function CreateProjectModal({
    context,
    id,
}: ContextModalProps<Record<string, never>>) {
    const form = useForm<{
        name: string;
        folder: string;
        icon: IconRepresentation;
    }>({
        initialValues: {
            name: "New Project",
            folder: "",
            icon: { family: "md", name: "MdBook" },
        },
    });
    const { t } = useTranslation();
    const fs = useFs();
    const notifs = useNotifications();
    const { setProject } = useProject();
    const nav = useNavigate();

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                createProject(fs, values.name, values.folder, values.icon).then(
                    (result) => {
                        if (isString(result)) {
                            notifs.showError(t(result));
                        } else {
                            notifs.showSuccess(
                                t("components.modals.createProject.success")
                            );
                            context.closeModal(id);
                            setProject({
                                id: snakeCase(values.name),
                                entrypoint: () => result,
                                onClose: () => setProject(null),
                            });
                            nav("/");
                        }
                    }
                );
            })}
        >
            <Stack gap="md">
                <TextInput
                    {...form.getInputProps("name")}
                    label={t("components.modals.createProject.name")}
                />
                <PathInput
                    mode="directory"
                    {...form.getInputProps("folder")}
                    label={t("components.modals.createProject.directory")}
                />
                <IconPicker
                    {...form.getInputProps("icon")}
                    label={t("components.modals.createProject.icon")}
                />
                <Button type="submit" fullWidth leftSection={<MdAdd />}>
                    {t("components.modals.createProject.submit")}
                </Button>
            </Stack>
        </form>
    );
}
