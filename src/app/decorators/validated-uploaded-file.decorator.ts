import { UploadedFile } from '@blazity/nest-file-fastify';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const ValidatedUploadedFile = ({
  fileType,
  maxSize,
}: {
  fileType: RegExp | string;
  maxSize: number;
}) =>
  UploadedFile([
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({ fileType }),
      ],
    }),
  ]);
