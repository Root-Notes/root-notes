import { useMemo } from "react";
import { IconBaseProps } from "react-icons";
import { IconFamilies, iconTypes } from "./types";

export function GenericIcon({
    family,
    name,
    ...props
}: { family: IconFamilies; name: string } & Partial<IconBaseProps>) {
    const Element = useMemo(
        () => (iconTypes as any)[family][name],
        [family, name]
    );

    return <Element className="root-icon" {...props} />;
}
