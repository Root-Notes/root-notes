import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { MdCheck, MdError } from "react-icons/md";

export function useNotifications() {
    const { t } = useTranslation();

    return {
        showError: (message: string) =>
            notifications.show({
                title: t("generic.error"),
                message,
                color: "red",
                icon: <MdError size={24} />,
            }),
        showSuccess: (message: string) =>
            notifications.show({
                title: t("generic.success"),
                message,
                color: "green",
                icon: <MdCheck size={24} />,
            }),
    };
}
