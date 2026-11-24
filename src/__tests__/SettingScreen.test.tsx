import React from 'react';
import { Alert, Linking } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import NativeTapTapBridge from '../native/NativeTapTapBridge';
import SettingScreen, { SERVICE_INTRO_URL } from '../screens/SettingScreen';
import { pressByTestId, queryByTestId, textContent } from '../testing/testUtils';

jest.mock('../native/NativeTapTapBridge', () => ({
  __esModule: true,
  default: {
    getAppInfo: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    trackSettingRowTapped: jest.fn(),
  },
}));

const bridge = NativeTapTapBridge as jest.Mocked<typeof NativeTapTapBridge>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function render() {
  let renderer!: ReactTestRenderer;
  await act(async () => {
    renderer = create(<SettingScreen />);
  });
  return renderer;
}

beforeEach(() => {
  jest.clearAllMocks();
  bridge.navigate.mockResolvedValue(undefined);
});

describe('앱 버전 행', () => {
  test('네이티브가 답하기 전에는 로딩을 보이고, 답하면 버전을 보인다', async () => {
    const pending = deferred<{ version: string }>();
    bridge.getAppInfo.mockReturnValue(pending.promise);

    const renderer = await render();
    expect(queryByTestId(renderer.root, 'setting.appVersion.loading')).not.toBeNull();
    expect(queryByTestId(renderer.root, 'setting.appVersion.value')).toBeNull();

    await act(async () => {
      pending.resolve({ version: '1.2.3' });
    });

    expect(queryByTestId(renderer.root, 'setting.appVersion.loading')).toBeNull();
    expect(textContent(queryByTestId(renderer.root, 'setting.appVersion.value')!)).toBe('1.2.3');
  });

  test('네이티브가 실패하면 다시 시도를 보이고, 다시 시도하면 버전을 불러온다', async () => {
    bridge.getAppInfo
      .mockRejectedValueOnce({ code: 'APP_INFO_UNAVAILABLE', message: 'forced' })
      .mockResolvedValueOnce({ version: '1.2.3' });

    const renderer = await render();
    expect(queryByTestId(renderer.root, 'setting.appVersion.retry')).not.toBeNull();

    await act(async () => {
      pressByTestId(renderer.root, 'setting.appVersion.retry');
    });

    expect(bridge.getAppInfo).toHaveBeenCalledTimes(2);
    expect(queryByTestId(renderer.root, 'setting.appVersion.retry')).toBeNull();
    expect(textContent(queryByTestId(renderer.root, 'setting.appVersion.value')!)).toBe('1.2.3');
  });
});

describe('네이티브 화면으로 이동', () => {
  beforeEach(() => {
    bridge.getAppInfo.mockResolvedValue({ version: '1.2.3' });
  });

  test.each([
    ['setting.tip.extensionSetting', 'safari_extension_tip', 'extensionSetting'],
    ['setting.tip.highlightGuide', 'highlight_tip', 'highlightGuide'],
    ['setting.tip.shareSetting', 'share_tip', 'shareSetting'],
    ['setting.tip.favoriteSetting', 'favorite_tip', 'favoriteSetting'],
    ['setting.privacyPolicy', 'privacy_policy', 'privacyPolicy'],
    ['setting.termsOfService', 'terms_of_service', 'termsOfService'],
    ['setting.openSource', 'open_source', 'openSourceList'],
  ])('%s는 기존 이벤트 %s를 남기고 %s 라우트를 요청한다', async (testID, row, route) => {
    const renderer = await render();

    await act(async () => {
      pressByTestId(renderer.root, testID);
    });

    expect(bridge.trackSettingRowTapped).toHaveBeenCalledWith(row);
    expect(bridge.navigate).toHaveBeenCalledWith(route);
  });

  test('네이티브가 라우트를 거절하면 안내를 띄운다', async () => {
    bridge.navigate.mockRejectedValueOnce({ code: 'UNKNOWN_ROUTE', message: 'unknown' });
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const renderer = await render();

    await act(async () => {
      pressByTestId(renderer.root, 'setting.tip.extensionSetting');
    });

    expect(alert).toHaveBeenCalledWith('화면을 열지 못했어요', '잠시 후 다시 시도해 주세요.');
  });

  test('서비스 소개는 링크를 열고 기존 이벤트를 남긴다', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const renderer = await render();

    await act(async () => {
      pressByTestId(renderer.root, 'setting.serviceIntro');
    });

    expect(openURL).toHaveBeenCalledWith(SERVICE_INTRO_URL);
    expect(bridge.trackSettingRowTapped).toHaveBeenCalledWith('service_open_link');
  });

  test('뒤로 가기는 네이티브에 화면 닫기를 요청한다', async () => {
    const renderer = await render();

    await act(async () => {
      pressByTestId(renderer.root, 'setting.topBar.back');
    });

    expect(bridge.goBack).toHaveBeenCalledTimes(1);
  });
});
