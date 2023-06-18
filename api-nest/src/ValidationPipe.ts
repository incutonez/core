import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe as OriginalValidation,
} from '@nestjs/common';
import { Errors, Model } from 'shared-ts/dist/Model';

@Injectable()
export class ValidationPipe extends OriginalValidation {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata || !this.toValidate(metadata)) {
      return value;
    }
    const record = (metadata.metatype as typeof Model).create(value);
    const isValid = await record.isValid(this.validatorOptions);
    if (isValid) {
      return record;
    }
    throw new HttpException(record[Errors], HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
