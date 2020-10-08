export function deleteProps<T>(object: any, props: string[]): T {
  props.forEach((prop) => {
    delete object[prop];
  });
  return object;
}
