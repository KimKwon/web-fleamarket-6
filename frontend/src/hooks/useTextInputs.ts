import { useState } from 'react';

interface useTextInputsProps<T> {
  initialValue: T;
}

function useTextInputs<T>({ initialValue }: useTextInputsProps<T>) {
  const [inputs, setInputs] = useState<T>(initialValue);

  const handleChange =
    (key: keyof T, regex = /[\s]/) =>
    ({ target }: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
      const value = target.value.replace(regex, '');

      setInputs({
        ...inputs,
        [key]: value,
      });
    };

  const resetInput = (key: keyof T) => {
    setInputs({
      ...inputs,
      [key]: '',
    });
  };

  return { inputs, handleChange, resetInput };
}

export default useTextInputs;
