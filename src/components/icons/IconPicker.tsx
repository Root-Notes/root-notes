import { Paper, Stack, Text } from "@mantine/core";
import { IconFamilies, IconRepresentation, iconTypes } from "./types";
import { useMemo } from "react";

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
            Object.entries(iconTypes).map(([family, icons]) => ({
                family: family as any,
                iconNames: Object.keys(icons),
            })),
        [families]
    );
    console.log(tabData);

    return (
        <Stack gap="sm" className="custom-input icon-picker">
            {label && <Text className="label">{label}</Text>}
            <Paper withBorder p="sm" className="content"></Paper>
        </Stack>
    );
}
