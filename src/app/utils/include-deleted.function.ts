export function includeDeleted(include: boolean = false) {
  return include ? { $in: [true, false] } : false;
}
