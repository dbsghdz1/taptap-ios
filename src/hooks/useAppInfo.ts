import { useCallback, useEffect, useState } from 'react';

import { type AppInfo, type BridgeError, loadAppInfo, toBridgeError } from '../bridge/taptapBridge';

export type AppInfoState =
  | { status: 'loading' }
  | { status: 'loaded'; info: AppInfo }
  | { status: 'failed'; error: BridgeError };

export function useAppInfo(load: () => Promise<AppInfo> = loadAppInfo) {
  const [state, setState] = useState<AppInfoState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    load().then(
      info => {
        if (!cancelled) {
          setState({ status: 'loaded', info });
        }
      },
      error => {
        if (!cancelled) {
          setState({ status: 'failed', error: toBridgeError(error) });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [attempt, load]);

  const retry = useCallback(() => setAttempt(value => value + 1), []);

  return { state, retry };
}
