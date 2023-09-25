import { Group, Modal, Paper, Stack, Text } from "@mantine/core";
import {
    IconFamilies,
    IconFamilyNames,
    IconRepresentation,
    iconTypes,
} from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenericIcon } from "./GenericIcon";
import { startCase } from "lodash";

function IconPickerModal({
    open,
    setOpen,
    value,
    setValue,
    families,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: IconRepresentation;
    setValue: (value: IconRepresentation) => void;
    families: IconFamilies[];
}) {
    const [tab, setTab] = useState<string | null>(families[0]);

    return (
        <Modal
            className="icon-picker-modal"
            opened={open}
            onClose={() => setOpen(false)}
            size="auto"
        ></Modal>
    );
}

export function IconPicker({
    // @ts-ignore
    value,
    // @ts-ignore
    onChange,
    families,
    label,
}: {
    value?: IconRepresentation;
    onChange?: (value: IconRepresentation) => void;
    families?: IconFamilies[];
    label?: string;
}) {
    const tabData: { family: IconFamilies; iconNames: string[] }[] = useMemo(
        () =>
            Object.entries(iconTypes)
                .filter(([family]) =>
                    (families ?? ["md", "tb", "gi", "di"]).includes(
                        family as any
                    )
                )
                .map(([family, icons]) => ({
                    family: family as any,
                    iconNames: Object.keys(icons),
                })),
        [families]
    );

    const [val, setVal] = useState<IconRepresentation>(
        value ?? { family: "md", name: "MdDescription" }
    );

    useEffect(() => {
        if (value) {
            setVal(value);
        }
    }, [value?.family, value?.name]);

    const setValue = useCallback(
        (value: IconRepresentation) => {
            if (onChange) {
                onChange(value);
            }
            setVal(value);
        },
        [onChange]
    );

    const iconName = useMemo(() => {
        const familyName = IconFamilyNames[val.family].name;
        const iconName = startCase(val.name).split(" ", 2)[1];
        return [familyName, iconName];
    }, [val.family, val.name]);

    const [open, setOpen] = useState(false);

    return (
        <>
            <Stack gap="sm" className="custom-input icon-picker">
                {label && <Text className="label">{label}</Text>}
                <Paper
                    p="sm"
                    className="content"
                    radius="sm"
                    onClick={() => setOpen(true)}
                >
                    <Group gap="sm" justify="space-between">
                        <GenericIcon
                            family={val.family}
                            name={val.name}
                            size={24}
                        />
                        <Stack gap={0} className="icon-name" align="flex-end">
                            <Text className="part name">{iconName[1]}</Text>
                            <Text className="part family" size="xs" c="dimmed">
                                {iconName[0]}
                            </Text>
                        </Stack>
                    </Group>
                </Paper>
            </Stack>
            <IconPickerModal
                open={open}
                setOpen={setOpen}
                value={val}
                setValue={setValue}
                families={families ?? ["md", "tb", "gi", "di"]}
            />
        </>
    );
}
