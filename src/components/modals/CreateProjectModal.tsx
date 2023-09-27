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
import { snakeCase, isString } from "lodash";
import { useNotifications } from "../../util/notifications";
import { useActivateProject } from "../../util/Project/util";
import { useNavigate } from "react-router-dom";

async function createProject(
    fs: LocalApi["fs"],
    name: string,
    folder: string,
    icon: IconRepresentation
): Promise<ProjectManifest | string> {
    const mkresult = await fs.mkdir([folder, snakeCase(name)], true);
    if (!mkresult.success) {
        return "errors.project.creation.fs";
    }
    const wrresult = await fs.writeFile.text(
        [folder, snakeCase(name), "root.json"],
        JSON.stringify({
            manifest: {
                name,
                id: snakeCase(name),
                icon,
            },
            records: [],
        })
    );

    if (!wrresult.success) {
        return "errors.project.creation.fs";
    }

    return {
        name,
        id: snakeCase(name),
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
    const activate = useActivateProject();
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
                            activate([
                                values.folder,
                                snakeCase(values.name),
                            ]).then((success) => {
                                if (success) {
                                    nav("/");
                                } else {
                                    notifs.showError(
                                        t("common.errors.project.open")
                                    );
                                }
                            });
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
