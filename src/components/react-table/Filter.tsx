import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./DebouncedInput";

type Props<T> = {
    column: Column<T, unknown>;
    filteredRows: string[],
};

export default function Filter<T>({ column, filteredRows }: Props<T>) {
    const columnFilterValue = column.getFilterValue();

    const uniqueFilterValues = new Set(filteredRows)

    const sortedUniqueValues = Array.from(uniqueFilterValues).sort()

    return (
        <>
        <datalist id={column.id+ 'list'}>
            {sortedUniqueValues.map((value, i) => (
                <option key={`${i}-${column.id}`} value={value} />
            ))}
        </datalist>
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={value => column.setFilterValue(value)}
            className="w-full border shadow rounded bg-card"
            placeholder={`Search (${uniqueFilterValues.size})`}
            list={column.id+ 'list'}
        />
        </>
    )
}