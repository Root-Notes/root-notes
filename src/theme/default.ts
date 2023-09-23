import { createTheme } from "@mantine/core";

export const themeDefault = createTheme({
    colors: {
        primary: [
            "#f2f0ff",
            "#e0dff2",
            "#bfbdde",
            "#9b98ca",
            "#7d79ba",
            "#6a65b0",
            "#605bac",
            "#504c97",
            "#464388",
            "#3b3979",
        ],
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "Roboto, sans-serif",
    fontFamilyMonospace: "Roboto Mono, sans-serif",
    headings: {
        fontFamily: "Roboto, sans-serif",
        fontWeight: "400",
    },
});
