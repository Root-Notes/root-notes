import { ActionIcon, Group, Input, Stack } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { MdClear, MdFolderOpen } from "react-icons/md";
import { useDialog } from "../../util/LocalApi/util";
import { useTranslation } from "react-i18next";

export type PathInputProps =
    | (
          | {
                multiple: true;
                value?: string[];
                defaultValue?: string[];
                onChange?: (value: string[]) => void;
            }
          | {
                multiple?: false;
                value?: string;
                defaultValue?: string;
                onChange?: (value: string) => void;
            }
      ) & {
          mode: "directory" | "file";
          label?: string;
          clearable?: boolean;
      };

export function PathInput({
    value,
    defaultValue,
    onChange,
    multiple,
    mode,
    clearable,
    label,
}: PathInputProps) {
    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: multiple ? [] : "",
        onChange,
    });

    const { open } = useDialog();
    const { t } = useTranslation();

    return (
        <Stack gap={0} className="path-input-wrapper">
            {label && <Input.Label>{label}</Input.Label>}
            <Group
                gap="xs"
                style={{
                    whiteSpace: "nowrap",
                    flexDirection: "row",
                }}
                className="path-input-group"
            >
                <Input
                    component="button"
                    type="button"
                    pointer
                    leftSection={<MdFolderOpen size={24} />}
                    style={{
                        overflowX: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: clearable ? "calc(100% - 46px)" : "100%",
                    }}
                    onClick={() =>
                        open({
                            title: t("inputs.path.title"),
                            properties: [
                                ...(multiple ? ["multiSelections"] : []),
                                mode === "directory"
                                    ? "openDirectory"
                                    : "openFile",
                                "createDirectory",
                            ] as any,
                        }).then(
                            (val) =>
                                val.success &&
                                !val.value.canceled &&
                                handleChange(
                                    multiple
                                        ? val.value.filePaths
                                        : val.value.filePaths[0]
                                )
                        )
                    }
                    className="path-input-field"
                >
                    {multiple ? (_value as string[]).join(", ") : _value}
                </Input>
                {clearable && (
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleChange(multiple ? [] : "");
                        }}
                    >
                        <MdClear size={20} />
                    </ActionIcon>
                )}
            </Group>
        </Stack>
    );
}
