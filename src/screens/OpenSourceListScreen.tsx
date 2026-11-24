import React from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { closeScreen, trackSettingRowTapped } from '../bridge/taptapBridge';
import { icons } from '../design/icons';
import { InfoListItem } from '../design/InfoListItem';
import { TopAppBar } from '../design/TopAppBar';
import { useColors } from '../design/tokens';

export const libraries = [
  { name: 'Composable Architecture', url: 'https://github.com/pointfreeco/swift-composable-architecture' },
  { name: 'Tuist', url: 'https://github.com/tuist/tuist' },
  { name: 'LinkNavigator', url: 'https://github.com/forXifLess/LinkNavigator' },
  { name: 'React Native', url: 'https://github.com/facebook/react-native' },
] as const;

function openLibrary(url: string) {
  trackSettingRowTapped('open_source_library');
  Linking.openURL(url).catch(() => {
    Alert.alert('링크를 열지 못했어요', '잠시 후 다시 시도해 주세요.');
  });
}

export default function OpenSourceListScreen() {
  const colors = useColors();
  return (
    <View testID="openSource.screen" style={[styles.screen, { backgroundColor: colors.background }]}>
      <TopAppBar title="사용된 오픈소스" onBack={closeScreen} testID="openSource.topBar" />
      <View style={styles.list}>
        {libraries.map(library => (
          <InfoListItem
            key={library.name}
            testID={`openSource.${library.name}`}
            icon={icons.opensource}
            title={library.name}
            onPress={() => openLibrary(library.url)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
  },
});
