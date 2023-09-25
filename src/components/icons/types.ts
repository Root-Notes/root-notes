export type IconFamilies = "md" | "gi" | "di" | "tb";
export type IconRepresentation = { family: IconFamilies; name: string };

export const IconFamilyNames: {
    [key in IconFamilies]: {
        name: string;
        icon: string;
    };
} = {
    md: {
        name: "Material Icons",
        icon: "MdStar",
    },
    gi: {
        name: "Game Icons",
        icon: "GiRollingDices",
    },
    di: {
        name: "Dev Icons",
        icon: "DiGit",
    },
    tb: {
        name: "Tabler Icons",
        icon: "TbAccessible",
    },
};

import * as IconsMd from "react-icons/md";
import * as IconsTb from "react-icons/tb";
import * as IconsDi from "react-icons/di";
import * as IconsGi from "react-icons/gi";

export const iconTypes = {
    md: IconsMd,
    tb: IconsTb,
    di: IconsDi,
    gi: IconsGi,
};
