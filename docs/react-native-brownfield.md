# React Native 브라운필드 전환 실험

탭탭 iOS 앱의 설정 화면 두 개를 React Native로 옮긴 실험 브랜치입니다. 기존 네이티브 앱에 RN을 붙이는 브라운필드 전환을 직접 해 보려고 만들었습니다. 탭탭은 iOS만 내는 앱이라 실제로 RN으로 바꿀 이유는 없고, 이 브랜치는 develop에 합치지 않습니다.

## 범위

| 구분 | 내용 |
|---|---|
| RN으로 옮긴 화면 | 설정, 사용된 오픈소스 |
| 네이티브로 남긴 화면 | Safari 확장 설정 안내, 하이라이트 연습, 공유 설정, 즐겨찾기 설정, 약관 |
| 지운 네이티브 코드 | Swift 파일 6개, 617줄. 설정 화면과 리듀서, 오픈소스 화면과 리듀서, 디자인 시스템의 `SettingTipCard`와 `InfoListItem`, 설정 이미지 4종, `AppRoute.openSourceList`, `Constants.notionLink` |
| 버전 | React Native 0.88.1, React 19.3, 새 아키텍처, Hermes |

설정 화면을 고른 이유는 통합 방식을 익히는 게 목적이었기 때문입니다. 사용자 영향이 작고 네이티브 의존이 적어서 빌드, 번들, 브릿지, 화면 이동, QA를 먼저 확인하기에 맞았습니다.

## 구조

### 화면 이동은 네이티브가 맡는다

RN 화면은 `navigate(route)`로 갈 화면의 이름만 요청하고, 네이티브 코디네이터가 그 이름을 실제 화면으로 바꿔 엽니다. 결과는 Promise로 돌려받고, 실패하면 RN 화면이 알림을 띄웁니다. 기존 TCA 코디네이터의 내비게이션 스택을 그대로 쓰고 RN 안에는 내비게이터를 두지 않았습니다.

### 브릿지

`src/native/NativeTapTapBridge.ts`의 스펙으로 codegen이 iOS와 Android의 TurboModule 인터페이스를 만듭니다.

| 메서드 | 하는 일 |
|---|---|
| `getAppInfo()` | 앱 버전을 Promise로 돌려줌 |
| `navigate(route)` | 네이티브 화면을 이름으로 엶 |
| `goBack()` | 현재 RN 화면을 닫음 |
| `trackSettingRowTapped(row)` | 기존과 같은 이름으로 탭 이벤트를 기록 |

오류는 코드로 나눴습니다. `APP_INFO_UNAVAILABLE`, `UNKNOWN_ROUTE`, `NAVIGATION_UNAVAILABLE`을 받고, 나머지는 `UNKNOWN`으로 묶습니다. 앱 버전 행은 불러오는 중, 값, 다시 시도 세 상태를 가집니다.

### 분석 이벤트

화면 조회는 네이티브가 기록하고, 탭 이벤트는 RN이 기존 이벤트 이름 그대로 보냅니다. RN 루트 뷰는 위에 네이티브 화면이 덮였다가 돌아와도 다시 마운트되지 않아서, RN에서 조회를 세면 돌아온 조회가 빠지기 때문입니다.

### iOS 빌드

- Tuist가 만든 워크스페이스에 CocoaPods를 얹습니다. `tuist generate` 다음에 `pod install`을 돌립니다.
- 앱 타깃의 xcconfig가 Pods 설정을 include하고, C++20과 RN 경로를 지정합니다.
- Debug는 Metro에서 JS를 받고, Release는 빌드 단계에서 만든 `main.jsbundle`을 앱에 넣습니다.

### Android 호스트

탭탭에는 Android 앱이 없어서, 같은 RN 화면을 띄우는 작은 호스트 앱을 `android/`에 만들었습니다. 홈과 네이티브 화면은 대역이고, 브릿지는 같은 스펙을 Kotlin으로 구현합니다.

## 옮기며 찾은 기존 버그

기존 화면을 읽고 테스트하다가 develop에도 있는 버그 두 개를 찾았습니다. 둘 다 develop 빌드에서 재현했고, 이 브랜치에서만 고쳤습니다.

1. 「서비스 이용약관」 행이 개인정보 처리방침 글을 보여 줍니다. 기존 `SettingFeature`가 두 행 모두에 `privacyPolicy`를 넘겼고 `termsOfService`는 쓰이지 않았습니다.
2. 설정에서 연 「하이라이트 및 메모 연습하기」 화면에서 뒤로 가기가 되지 않습니다. 코디네이터에 이 화면의 뒤로 가기 처리가 없었습니다.

## 검증

- Jest 단위 테스트 22개
- Maestro 흐름 iOS 6개, Android 6개

| 흐름 | 확인하는 것 |
|---|---|
| 01 | 홈에서 설정 진입, 홈으로 복귀 |
| 02 | RN 설정에서 네이티브 화면을 열고 돌아오기 |
| 03 | RN에서 RN 화면 열기 |
| 04 | 앱 정보를 불러오는 중인 상태 |
| 05 | 앱 정보 실패 후 다시 시도 |
| 06 | 약관 화면의 글이 맞는지 |

로딩과 실패는 디버그 빌드에서만 켜지는 주입으로 재현합니다. iOS는 실행 인자 `RNFaultAppInfoDelayMs`, `RNFaultAppInfoFailCount`를, Android는 같은 이름의 인텐트 extra를 씁니다.

Release 빌드는 Metro를 끈 채 앱 안의 `main.jsbundle`로 실행해 01, 02, 03, 06 흐름을 확인했습니다. 04와 05는 디버그 빌드에서만 켜지는 주입이 필요해서 Release에서는 돌리지 않습니다. Release 구성은 번들 ID가 `com.Nbs.dev.ADA.app`라 Debug 앱과 따로 설치되므로, 흐름의 appId를 바꾸고 온보딩 완료 값을 앱 설정에 미리 써서 돌렸습니다.

## 실행 방법

```sh
npm install
cd TapTap && tuist install && tuist generate --no-open && pod install && cd ..
npx react-native start
```

시뮬레이터에서도 App Group 컨테이너가 있어야 앱이 시작합니다. 서명을 끄지 말고 ad-hoc 서명으로 빌드합니다.

```sh
xcodebuild -workspace TapTap/TapTap.xcworkspace -scheme TapTap -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  CODE_SIGN_IDENTITY=- CODE_SIGNING_REQUIRED=NO PROVISIONING_PROFILE_SPECIFIER= DEVELOPMENT_TEAM= build
maestro test .maestro/ios/
```

```sh
cd android && ./gradlew installDebug && cd ..
adb reverse tcp:8081 tcp:8081
maestro test .maestro/android/
```

## 붙여 보고 알게 된 것

- CocoaPods가 없던 프로젝트에 Pod 86개가 붙고, `tuist generate` 다음 `pod install`이라는 단계가 생깁니다.
- 시뮬레이터에서도 App Group 권한이 든 서명이 있어야 앱이 시작합니다.
- Android로 낸다면 목록, 카테고리, 검색, 설정 같은 화면은 함께 쓸 수 있습니다. 하지만 사용자가 탭탭을 쓰기 시작하는 Safari 확장과, App Group, SwiftData, iCloud로 된 저장과 동기화는 Android에서 새로 만들어야 합니다.
