export const debounce = (func: () => void, delay: number) => {
  let timeout: number | undefined;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
