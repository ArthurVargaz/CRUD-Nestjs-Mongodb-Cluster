import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidacaoParametrosPipe implements PipeTransform {
  transform(value: undefined, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(metadata.data + ' NOT VALID');
    }
    return value;
  }
}
