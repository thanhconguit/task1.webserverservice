import { QueryParams } from "./types";

export function createQueryString(query: QueryParams): string {
    const params = new URLSearchParams();

    if (query.PageIndex !== undefined) params.append("PageIndex", query.PageIndex.toString());
    if (query.PageSize !== undefined) params.append("PageSize", query.PageSize.toString());
    if (query.SortedField !== undefined) params.append("SortedField", query.SortedField);
    if (query.SortedType !== undefined) params.append("SortedType", query.SortedType.toString());

    if (query.Filters) {
        query.Filters.forEach((filter, index) => {
            if (filter.Column !== undefined) params.append(`Filters[${index}].Column`, filter.Column);
            if (filter.Value !== undefined) params.append(`Filters[${index}].Value`, filter.Value);
        });
    }

    return params.toString();
}
export function isNullOrEmptyOrWhitespace(str: any) {
    return str === null || str === undefined || str.trim() === '';
}

export function capitalizeFirstLetter(input: string): string {
    if (!input) {
        return input;
    }

    return input.charAt(0).toUpperCase() + input.slice(1);
}

 