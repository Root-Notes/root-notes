import { Button, Stack, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";

//@ts-ignore
export function CreateProjectModal(props: ContextModalProps<Record<string, never>>) {
    const form = useForm<{ name: string; folder: string; icon: string | null }>(
        {
            initialValues: {
                name: "New Project",
                folder: "",
                icon: null,
            },
        }
    );
    const { t } = useTranslation();
    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stack gap="md">
                <TextInput
                    {...form.getInputProps("name")}
                    label={t("components.modals.createProject.name")}
                />
                <Button type="submit" fullWidth leftSection={<MdAdd />}>
                    {t("components.modals.createProject.submit")}
                </Button>
            </Stack>
        </form>
    );
}
