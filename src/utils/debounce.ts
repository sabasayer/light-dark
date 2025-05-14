export const debounce = (func: () => void, timeout = 300) => {
  let timer: number | undefined;
  console.log("debounce");
  return (...args: any[]) => {
    clearTimeout(timer);
    console.log("debounce clearTimeout");
    timer = setTimeout(() => {
      console.log("debounce timeout");
      func.apply(this, args);
    }, timeout);
  };
};
