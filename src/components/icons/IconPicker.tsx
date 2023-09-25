import {
    Group,
    Modal,
    Pagination,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import {
    IconFamilies,
    IconFamilyNames,
    IconRepresentation,
    iconTypes,
} from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenericIcon } from "./GenericIcon";
import { startCase } from "lodash";
import { useTranslation } from "react-i18next";
import { MdSearch } from "react-icons/md";

type TabData = { family: IconFamilies; iconNames: string[] };

function IconPickerTab({
    value,
    setValue,
    data,
    family,
}: {
    value: IconRepresentation;
    setValue: (value: IconRepresentation) => void;
    data: TabData;
    family: IconFamilies;
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);

    const displayedIcons: { name: string; friendly: string }[] = useMemo(
        () =>
            data.iconNames
                .filter(
                    (name) =>
                        name
                            .toLocaleLowerCase()
                            .includes(search.toLocaleLowerCase()) ||
                        search
                            .toLocaleLowerCase()
                            .includes(name.toLocaleLowerCase()) ||
                        startCase(name)
                            .split(" ")
                            .slice(1)
                            .join(" ")
                            .toLocaleLowerCase()
                            .includes(search.toLocaleLowerCase()) ||
                        search
                            .toLocaleLowerCase()
                            .includes(
                                startCase(name)
                                    .split(" ")
                                    .slice(1)
                                    .join(" ")
                                    .toLocaleLowerCase()
                            )
                )
                .slice(page * pageSize, (page + 1) * pageSize)
                .map((name) => ({
                    name,
                    friendly: startCase(name).split(" ").slice(1).join(" "),
                })),
        [page, pageSize, search, data.iconNames, data.family]
    );

    const pages = useMemo(
        () => Math.ceil(data.iconNames.length / pageSize),
        [pageSize, data.iconNames.length]
    );

    return (
        <Tabs.Panel value={family} p="md">
            <Stack gap="md" className="picker-tab-panel">
                <TextInput
                    leftSection={<MdSearch />}
                    value={search}
                    onChange={(ev) => setSearch(ev.target.value)}
                    label={t("components.modals.iconPicker.panel.search")}
                />
                <SimpleGrid cols={5} spacing="sm" className="icon-list">
                    {displayedIcons.map((icon) => (
                        <Tooltip
                            label={icon.friendly}
                            key={icon.name}
                            position="bottom"
                            withArrow
                        >
                            <Paper
                                shadow="sm"
                                p="sm"
                                className={
                                    "icon-item" +
                                    (value.family === family &&
                                    value.name === icon.name
                                        ? " selected"
                                        : "")
                                }
                                onClick={() =>
                                    setValue({ family, name: icon.name })
                                }
                            >
                                <Stack justify="center" align="center" gap="xs">
                                    <GenericIcon
                                        family={family}
                                        name={icon.name}
                                        size={32}
                                    />
                                    <Text
                                        ta="center"
                                        size="xs"
                                        className="icon-name"
                                    >
                                        {icon.friendly}
                                    </Text>
                                </Stack>
                            </Paper>
                        </Tooltip>
                    ))}
                </SimpleGrid>
                <Group gap="sm" className="controls">
                    <Pagination
                        className="page-selector"
                        value={page + 1}
                        onChange={(p) => setPage(p - 1)}
                        total={pages}
                        siblings={2}
                    />
                    <Select
                        data={["10", "25", "50", "100"]}
                        value={pageSize.toString()}
                        onChange={(value) => setPageSize(Number(value ?? "25"))}
                        className="page-size-selector"
                        label={t("components.modals.iconPicker.panel.pageSize")}
                    />
                </Group>
            </Stack>
        </Tabs.Panel>
    );
}

function IconPickerModal({
    open,
    setOpen,
    value,
    setValue,
    families,
    tabData,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: IconRepresentation;
    setValue: (value: IconRepresentation) => void;
    families: IconFamilies[];
    tabData: TabData[];
}) {
    const [tab, setTab] = useState<string | null>(families[0]);
    const { t } = useTranslation();

    return (
        <Modal
            className="icon-picker-modal"
            opened={open}
            onClose={() => setOpen(false)}
            size="xl"
            title={t("components.modals.iconPicker.title")}
        >
            <Tabs value={tab} onChange={setTab} className="icon-families">
                <Tabs.List grow>
                    {families.map((fam) => (
                        <Tabs.Tab value={fam} key={fam}>
                            <Group gap="sm">
                                <GenericIcon
                                    family={fam}
                                    name={IconFamilyNames[fam].icon}
                                    size={24}
                                />
                                <Text>{IconFamilyNames[fam].name}</Text>
                            </Group>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {families.map((fam) => (
                    <IconPickerTab
                        value={value}
                        setValue={(value) => {
                            setValue(value);
                            setOpen(false);
                        }}
                        data={tabData.filter((v) => v.family === fam)[0]}
                        family={fam}
                        key={fam}
                    />
                ))}
            </Tabs>
        </Modal>
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
    const tabData: TabData[] = useMemo(
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
        const iconName = startCase(val.name).split(" ").slice(1).join(" ");
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
                            size={32}
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
                tabData={tabData}
            />
        </>
    );
}
