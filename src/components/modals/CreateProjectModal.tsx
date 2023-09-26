import { Button, Stack, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { IconPicker, IconRepresentation } from "@root-notes/common";
import { PathInput } from "../form/PathInput";
import { useFs } from "../../util/LocalApi";
import { LocalApi } from "../../util/LocalApi";
import { ProjectManifest } from "@root-notes/common";
import { join } from "path-browserify";
import { snakeCase, isString } from "lodash";
import { useNotifications } from "../../util/notifications";

async function createProject(
    fs: LocalApi["fs"],
    name: string,
    folder: string,
    icon: IconRepresentation
): Promise<ProjectManifest | string> {
    const desiredPath = join(folder, snakeCase(name));
    const mkresult = await fs.mkdir(desiredPath, true);
    if (!mkresult.success) {
        return "errors.project.creation.fs";
    }
    const wrresult = await fs.writeFile.text(
        desiredPath + "/root.json",
        JSON.stringify({
            name,
            folder: desiredPath,
            icon,
        })
    );

    if (!wrresult.success) {
        return "errors.project.creation.fs";
    }

    return {
        name,
        folder: desiredPath,
        icon,
    };
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

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                createProject(fs, values.name, values.folder, values.icon).then(
                    (result) => {
                        if (isString(result)) {
                            notifs.showError(t(result));
                        } else {
                            notifs.showError(
                                t("components.modals.createProject.success")
                            );
                            context.closeModal(id);
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
