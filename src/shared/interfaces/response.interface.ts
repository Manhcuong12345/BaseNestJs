export interface IFResponse<T> {
    data: T[];
    meta_data: {
        total_records: number;
        limit: string;
        page: string;
        total_page: number;
    };
}
