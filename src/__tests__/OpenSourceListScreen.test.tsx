import React from 'react';
import { Linking } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import NativeTapTapBridge from '../native/NativeTapTapBridge';
import OpenSourceListScreen, { libraries } from '../screens/OpenSourceListScreen';
import { pressByTestId } from '../testing/testUtils';

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

test.each(libraries.map(library => [library.name, library.url]))(
  '%s를 누르면 링크를 열고 기존 이벤트를 남긴다',
  async (name, url) => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = create(<OpenSourceListScreen />);
    });

    await act(async () => {
      pressByTestId(renderer.root, `openSource.${name}`);
    });

    expect(openURL).toHaveBeenCalledWith(url);
    expect(bridge.trackSettingRowTapped).toHaveBeenCalledWith('open_source_library');
  },
);
