function debounce(cb: CallableFunction, delay: number) {
  let debounceTimer: number | null = null;

  return function (...args: unknown[]) {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export default debounce;
