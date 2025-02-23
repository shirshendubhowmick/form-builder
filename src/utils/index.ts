// eslint-disable-next-line import/prefer-default-export
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delayInMs: number,
): T {
  let timeoutId: ReturnType<typeof setTimeout>;

  return ((...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delayInMs);
  }) as T;
}
