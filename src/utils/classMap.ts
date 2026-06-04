/** Compose a className from a map of class → enabled (or a base string), with an optional extra string appended. */
export const classMap = (classObj: Record<string, boolean> | string, classString?: string): string => {
    if (typeof classObj === "string") {
        return classString ? `${classObj} ${classString}` : classObj;
    }

    const composed = Object.keys(classObj).reduce<string>((acc, key) => {
        if (!classObj[key]) {
            return acc;
        }
        return acc === "" ? key : `${acc} ${key}`;
    }, "");

    return classString ? `${composed} ${classString}` : composed;
};
