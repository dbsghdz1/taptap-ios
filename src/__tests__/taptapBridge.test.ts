import { BridgeError, toBridgeError } from '../bridge/taptapBridge';

jest.mock('../native/NativeTapTapBridge', () => ({ __esModule: true, default: {} }));

test.each([
  [{ code: 'APP_INFO_UNAVAILABLE', message: 'm' }, 'APP_INFO_UNAVAILABLE'],
  [{ code: 'UNKNOWN_ROUTE', message: 'm' }, 'UNKNOWN_ROUTE'],
  [{ code: 'NAVIGATION_UNAVAILABLE', message: 'm' }, 'NAVIGATION_UNAVAILABLE'],
  [{ code: 'E_SOMETHING_ELSE', message: 'm' }, 'UNKNOWN'],
  [new Error('plain'), 'UNKNOWN'],
  [null, 'UNKNOWN'],
])('네이티브 오류 %p는 %s 코드로 정리된다', (raw, code) => {
  const error = toBridgeError(raw);
  expect(error).toBeInstanceOf(BridgeError);
  expect(error.code).toBe(code);
});
