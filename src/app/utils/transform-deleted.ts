import { TransformFnParams } from 'class-transformer';

export function excludeDeleted(
  arg: ((params: TransformFnParams) => unknown) | TransformFnParams,
) {
  if (typeof arg !== 'function') {
    return arg.obj.isDeleted ? undefined : arg.value;
  }

  return function (params: Parameters<typeof arg>[0]) {
    if (params.obj.isDeleted) {
      return undefined;
    }

    return arg(params);
  };
}

export function exposeDeleted({ obj, value }: TransformFnParams) {
  return obj.isDeleted ? value : undefined;
}
