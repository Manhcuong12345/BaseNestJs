import { PipeTransform, Injectable, HttpException } from '@nestjs/common';
import { PAGE_AND_LIMIT_MUST_BE_NUMBER } from '../constants/err.constants';

@Injectable()
export class PagingPipe implements PipeTransform<any, any> {
    transform(value: any): any {
        if ((value.page && isNaN(value.page)) || (value.limit && isNaN(value.limit)))
            throw new HttpException(PAGE_AND_LIMIT_MUST_BE_NUMBER, 400);
        //throw new BadRequestException('Page and limit should be a numberic');

        value.page = value.page ? parseInt(value.page, 10) : value.page;
        value.limit = value.limit ? parseInt(value.limit, 10) : value.limit;

        return value;
    }
}
