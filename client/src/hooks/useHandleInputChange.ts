import type React from "react";

export default function useHandleInputChange<T>(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<T>>,
): void {
  const { value, name } = e.target;

  setState((prev) => ({
    ...prev,
    [name]: value,
  }));
}
