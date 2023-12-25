import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { parse } from 'qs';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(
    value: Record<string, string> | string,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.type !== 'query') return value;
    return parse(value);
  }
}
