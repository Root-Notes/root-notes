import { useTranslation } from "react-i18next";
import { CreateProjectModal } from "./CreateProjectModal";
import { modals } from "@mantine/modals";

export const MODALS = {
    createProject: CreateProjectModal,
};

export function useOpenModals() {
    const { t } = useTranslation();
    return {
        createProject: () =>
            modals.openContextModal({
                title: t("components.modals.createProject.title"),
                modal: "createProject",
                innerProps: {},
            }),
    };
}
