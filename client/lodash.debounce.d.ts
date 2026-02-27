declare module "lodash.debounce" {
  interface DebouncedFunc<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel(): void;
    flush(): ReturnType<T> | undefined;
  }

  function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait?: number
  ): DebouncedFunc<T>;

  export default debounce;
}
