export function paginate(items: any[], page: number) {
  const MAX = 10;
  return items.slice((page - 1) * MAX, page * MAX);
}