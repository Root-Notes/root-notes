import { Button, Stack, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { IconPicker, IconRepresentation } from "@root-notes/common";
import { PathInput } from "../form/PathInput";

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

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                console.log(values);
                context.closeModal(id);
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
