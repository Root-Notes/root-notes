import { useEffect, useState } from "react";

export function useMemoAsync<T>(
    func: () => Promise<T>,
    dependencies: any[],
    defaultValue: T
): T {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        func().then(setValue);
    }, dependencies);
    return value;
}
