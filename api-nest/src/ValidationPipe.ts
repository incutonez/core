import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Model } from 'shared-ts/dist/Model';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const record: Model = (metatype as typeof Model).create(value);
    const isValid = await record.isValid({ whitelist: true });
    if (isValid) {
      return record;
    }
    throw new Error('Validation failed');
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
