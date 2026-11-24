import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  closeScreen,
  type NativeRoute,
  openNativeRoute,
  type SettingRow,
  trackSettingRowTapped,
} from '../bridge/taptapBridge';
import { Divider } from '../design/Divider';
import { icons, tipImages, type TipImage } from '../design/icons';
import { InfoListItem, type InfoListTrailing } from '../design/InfoListItem';
import { SectionHeader } from '../design/SectionHeader';
import { SettingTipCard } from '../design/SettingTipCard';
import { TopAppBar } from '../design/TopAppBar';
import { typography, useColors, useColorSchemeName } from '../design/tokens';
import { type AppInfoState, useAppInfo } from '../hooks/useAppInfo';

export const SERVICE_INTRO_URL = 'https://nettle-check-e5b.notion.site/taptap';

type Tip = {
  image: TipImage;
  title: string;
  row: SettingRow;
  route: NativeRoute;
};

const tips: Tip[] = [
  { image: 'safari', title: 'Safari extension 허용하기', row: 'safari_extension_tip', route: 'extensionSetting' },
  { image: 'highlight', title: '하이라이트 및 메모 \n연습하기', row: 'highlight_tip', route: 'highlightGuide' },
  { image: 'share', title: '우리앱으로 손쉽게 \n공유하기', row: 'share_tip', route: 'shareSetting' },
  { image: 'favorite', title: '즐겨찾기 설정하기', row: 'favorite_tip', route: 'favoriteSetting' },
];

function showNavigationFailure() {
  Alert.alert('화면을 열지 못했어요', '잠시 후 다시 시도해 주세요.');
}

export default function SettingScreen() {
  const colors = useColors();
  const scheme = useColorSchemeName();
  const { state: appInfo, retry } = useAppInfo();

  const open = useCallback((row: SettingRow, route: NativeRoute) => {
    trackSettingRowTapped(row);
    openNativeRoute(route).catch(showNavigationFailure);
  }, []);

  const openServiceIntro = useCallback(() => {
    Linking.openURL(SERVICE_INTRO_URL).catch(showNavigationFailure);
    trackSettingRowTapped('service_open_link');
  }, []);

  return (
    <View testID="setting.screen" style={[styles.screen, { backgroundColor: colors.background }]}>
      <TopAppBar title="설정" onBack={closeScreen} testID="setting.topBar" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.tipSection}>
          <SectionHeader title="알아두면 좋은 팁" />
          <View style={styles.grid}>
            {[tips.slice(0, 2), tips.slice(2, 4)].map((pair, index) => (
              <View key={index} style={styles.gridRow}>
                {pair.map(tip => (
                  <View key={tip.row} style={styles.gridCell}>
                    <SettingTipCard
                      testID={`setting.tip.${tip.route}`}
                      image={tipImages[scheme][tip.image]}
                      title={tip.title}
                      onPress={() => open(tip.row, tip.route)}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <Divider />

        <View style={styles.infoSection}>
          <SectionHeader title="정보" />
          <View style={styles.infoList}>
            <InfoListItem
              testID="setting.appVersion"
              icon={icons.info}
              title="앱 버전"
              trailing={appVersionTrailing(appInfo, retry, colors.caption1)}
            />
            <InfoListItem
              testID="setting.privacyPolicy"
              icon={icons.shield}
              title="개인정보 처리방침"
              onPress={() => open('privacy_policy', 'privacyPolicy')}
            />
            <InfoListItem
              testID="setting.termsOfService"
              icon={icons.file}
              title="서비스 이용약관"
              onPress={() => open('terms_of_service', 'termsOfService')}
            />
            <InfoListItem
              testID="setting.openSource"
              icon={icons.opensource}
              title="사용된 오픈 소스"
              onPress={() => open('open_source', 'openSourceList')}
            />
            <InfoListItem
              testID="setting.serviceIntro"
              icon={icons.heart}
              title="탭탭 서비스 소개"
              onPress={openServiceIntro}
            />
          </View>
          <TeamInfo />
        </View>
      </ScrollView>
    </View>
  );
}

function appVersionTrailing(state: AppInfoState, retry: () => void, color: string): InfoListTrailing {
  switch (state.status) {
    case 'loading':
      return {
        kind: 'custom',
        node: (
          <ActivityIndicator
            testID="setting.appVersion.loading"
            accessibilityLabel="앱 버전을 불러오는 중"
            color={color}
            style={styles.trailingSpacing}
          />
        ),
      };
    case 'loaded':
      return { kind: 'text', value: state.info.version };
    case 'failed':
      return {
        kind: 'custom',
        node: (
          <Pressable
            testID="setting.appVersion.retry"
            accessibilityRole="button"
            accessibilityLabel="앱 버전을 불러오지 못했어요. 다시 시도"
            onPress={retry}
            style={styles.trailingSpacing}>
            <Text style={[typography.B1_M, { color }]}>다시 시도</Text>
          </Pressable>
        ),
      };
  }
}

function TeamInfo() {
  const colors = useColors();
  const textStyle = [typography.C2, { color: colors.caption3 }];
  return (
    <View style={styles.team}>
      <View style={styles.teamDivider}>
        <Divider />
      </View>
      <Text style={textStyle}>Designed by 조혜준, 진서영.</Text>
      <Text style={textStyle}>Developed by 김윤홍, 여성일, 이승진.</Text>
      <Text style={textStyle}>Managed by 신지현.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 20,
    gap: 8,
  },
  tipSection: {
    paddingBottom: 24,
    gap: 10,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
  },
  infoSection: {
    paddingTop: 12,
  },
  infoList: {
    paddingBottom: 16,
  },
  trailingSpacing: {
    marginRight: 8,
  },
  team: {
    paddingBottom: 68,
  },
  teamDivider: {
    paddingBottom: 24,
  },
});
