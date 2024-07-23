export function mergeUnique<T>(oldItems: T[], newItems: T[], idGetter: (item: T) => any): T[] {
    const existingIds = new Set(oldItems.map(idGetter));
    const result = [
        ...oldItems,
        ...newItems.filter(item => !existingIds.has(idGetter(item)))
    ];
    return result;
}
