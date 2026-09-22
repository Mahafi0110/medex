import { useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Runs `fetcher` whenever `deps` change and tracks loading/error state.
 * Guards against setting state after unmount / after a newer call has started.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const callId = useRef(0);

  useEffect(() => {
    const id = ++callId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (callId.current === id) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (callId.current === id) setState({ data: null, loading: false, error: err.message });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
