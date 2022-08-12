import { IFResponse } from '../interfaces/response.interface';

export class ResponseService {
    getResponse<T>(data: T[], totalRecords: number, page: number, limit: number): IFResponse<T> {
        return {
            data: data,
            meta_data: {
                total_records: totalRecords,
                page: page.toString(),
                limit: limit.toString(),
                total_page: Math.ceil(totalRecords / Number(limit))
            }
        };
    }
}
