import { PipeTransform, Injectable, HttpException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new HttpException(error.details[0].message, 400);
        }
        return value;
    }
}
