import NativeTapTapBridge, { type AppInfo } from '../native/NativeTapTapBridge';

export type { AppInfo };

export type NativeRoute =
  | 'extensionSetting'
  | 'highlightGuide'
  | 'shareSetting'
  | 'favoriteSetting'
  | 'privacyPolicy'
  | 'termsOfService'
  | 'openSourceList';

export type SettingRow =
  | 'safari_extension_tip'
  | 'highlight_tip'
  | 'share_tip'
  | 'favorite_tip'
  | 'privacy_policy'
  | 'terms_of_service'
  | 'open_source'
  | 'service_open_link'
  | 'open_source_library';

export type BridgeErrorCode =
  | 'APP_INFO_UNAVAILABLE'
  | 'UNKNOWN_ROUTE'
  | 'NAVIGATION_UNAVAILABLE'
  | 'UNKNOWN';

const knownCodes: readonly BridgeErrorCode[] = [
  'APP_INFO_UNAVAILABLE',
  'UNKNOWN_ROUTE',
  'NAVIGATION_UNAVAILABLE',
];

export class BridgeError extends Error {
  readonly code: BridgeErrorCode;

  constructor(code: BridgeErrorCode, message: string) {
    super(message);
    this.name = 'BridgeError';
    this.code = code;
  }
}

export function toBridgeError(error: unknown): BridgeError {
  if (error instanceof BridgeError) {
    return error;
  }
  const raw = error as { code?: unknown; message?: unknown } | null;
  const code =
    typeof raw?.code === 'string' && (knownCodes as readonly string[]).includes(raw.code)
      ? (raw.code as BridgeErrorCode)
      : 'UNKNOWN';
  const message = typeof raw?.message === 'string' ? raw.message : 'Native bridge call failed';
  return new BridgeError(code, message);
}

export async function loadAppInfo(): Promise<AppInfo> {
  try {
    return await NativeTapTapBridge.getAppInfo();
  } catch (error) {
    throw toBridgeError(error);
  }
}

export async function openNativeRoute(route: NativeRoute): Promise<void> {
  try {
    await NativeTapTapBridge.navigate(route);
  } catch (error) {
    throw toBridgeError(error);
  }
}

export function closeScreen(): void {
  NativeTapTapBridge.goBack();
}

export function trackSettingRowTapped(row: SettingRow): void {
  NativeTapTapBridge.trackSettingRowTapped(row);
}
