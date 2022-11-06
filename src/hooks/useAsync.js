import { useEffect, useCallback, useState } from "react";

export function useAsync(func, dependancies = []) {
  const { execute, ...state } = useAsyncInternal(func, dependancies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}
export function useAsyncFn(func, dependancies = []) {
  return useAsyncInternal(func, dependancies, false);
}

function useAsyncInternal(func, dependancies, initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        setValue(data);
        setError(undefined);
        return data;
      })
      .catch((error) => {
        setValue(undefined);
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependancies);

  return { loading, error, value, execute };
}
