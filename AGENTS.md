# TapTap 작업 규칙

홍이 방향을 정하고 에이전트가 구현하며, 매주 한 번 릴리스한다. PR과 릴리스는 전역 `github-pr`, `appstore-release` 스킬과 다르면 이 문서를 따른다.

## 일하는 순서

기능 작업은 spec에서 시작해 릴리스로 끝난다. spec 하나가 릴리스 하나다.

1. **spec**: `docs/specs/TEMPLATE.md` 형식으로 `docs/specs/NNN-제목.md`를 쓴다.
2. **plan**: 홍이 「설계」 절을 확정하면 상태를 `확정`으로 바꾼다.
3. **구현**: `develop`에서 `타입/한국어-설명` 브랜치(예: `feat/계측-정리`)를 따고 상태를 `구현 중`으로 바꾼다. 논리적 변경 하나를 커밋 하나로 만든다. spec에 없는 변경이 필요해지면 spec을 먼저 고친다.
4. **검증**: 완료 조건을 하나씩 실행해 확인하고 결과를 PR 본문에 적는다. 실기기나 계정이 필요한 항목은 「홍이 확인할 것」으로 넘긴다.
5. **PR**: 아래 「PR」 절을 따른다.
6. **릴리스**: 아래 「릴리스」 절을 따른다. 심사에 제출하면 상태를 `출시`로 바꾼다.

병합, 스토어 업로드, 심사 제출은 홍이 지시했을 때 한다. 오타나 빌드 설정 같은 작은 수정은 spec 없이 PR로 올린다.

## 범위

- 주력은 iOS 앱(`Projects/App`, `Projects/Feature/*`)과 Safari 확장이다.
- macOS 앱(`Projects/TapTapMac`, `Projects/MacFeature`)은 동결했다. 아래 「맥에 같이 들어가는 코드」를 고쳐 맥 빌드가 깨질 때만 고친다.
- iPad 지원은 보류했고 하던 작업은 `feat/ipad-mac-layout` 브랜치에 있다.

## 레포

- 개발 레포는 `dbsghdz1/taptap-ios`다. 브랜치, PR, 릴리스는 모두 여기서 한다.
- `TapTapTeam/taptap-ios`는 팀 시절의 PR 81개와 이슈 71개를 보관하는 레포다. 팀원들이 주소를 쓰고 있어 그대로 두고 읽기만 한다. 같은 조직의 `TapTapTeam/taptap-match`는 fastlane match가 인증서를 읽어 오는 레포다.
- 보관 레포의 PR과 이슈는 「보관 레포 PR 152」처럼 `#` 없이 적는다. `#번호`는 개발 레포의 번호로 이어지고, 링크나 `TapTapTeam/taptap-ios#번호`는 보관 레포 타임라인에 참조를 남긴다. git log의 병합 커밋 제목에 있는 번호도 보관 레포 번호다.

## 빌드와 검증

Tuist가 프로젝트 파일을 만든다. 명령은 `TapTap/`에서 실행한다.

```sh
tuist install && tuist generate --no-open
xcodebuild -workspace TapTap.xcworkspace -scheme TapTap -destination 'generic/platform=iOS Simulator' build
xcodebuild -workspace TapTap.xcworkspace -scheme TapTapMac build
xcodebuild -workspace TapTap.xcworkspace -scheme AnalyticsKit -destination 'platform=iOS Simulator,name=iPhone 17' test
```

- 타깃, 설정, 의존성은 `Projects/*/Project.swift`와 `Tuist/ProjectDescriptionHelpers/`에서 고친다. `.xcodeproj`와 `.xcworkspace`는 생성물이라 git에 없다. 파일을 더하거나 지운 뒤에는 `tuist generate --no-open`을 다시 돌린다.
- 비밀값 파일은 git에 없다: `TapTap/Tuist/Config/Project.xcconfig`(서명, 버전, 분석 키), `TapTap/fastlane/.env`(릴리스 키), `TapTap/Projects/App/Resources/GoogleService-Info.plist`(GA4). 내용을 읽거나 출력하지 않는다. xcconfig가 없으면 홍에게 요청한다. plist는 없어도 GA4만 빠진 채 빌드된다.
- `-derivedDataPath`가 필요하면 gitignore된 `TapTap/dd/`를 쓴다.
- 시뮬레이터에서 실행할 빌드는 서명을 켠 채로 만든다. `CODE_SIGNING_ALLOWED=NO` 빌드는 App Group 권한이 빠져 `AppGroupContainer`의 `fatalError`로 실행 직후 죽는다.
- 실제 테스트가 있는 타깃은 `AnalyticsKitTests`다. 리듀서 테스트는 각 iOS Feature의 `<이름>Tests` 타깃에 쓴다.

## 코드

- 설명은 커밋 메시지와 PR 본문에 쓴다. 새 코드는 설명 주석 없이 쓰고, 고친 코드와 맞지 않게 된 기존 주석은 지운다.
- 커밋 제목은 `feat:`, `fix:`, `chore:`, `docs:`, `design:`, `refactor:` 가운데 하나로 시작하고 한국어로 쓴다.
- `Projects/Core/Sources/SwiftDataModel/`의 모델을 바꾸면 새 `VersionedSchema`와 `TapTapMigrationPlan` 단계를 더하고 모델 typealias를 새 스키마로 옮긴다. 새 속성에는 기본값을 준다. 앱과 두 확장이 같은 App Group 저장소를 쓰고, 마이그레이션이 실패하면 앱이 시작하자마자 죽는다.
- `Projects/Feature/` 바로 아래의 `Sources/`와 `Resources/`는 어느 타깃에도 들어가지 않는 옛 사본이다. 원문 보기 웹뷰 스크립트는 `Projects/Feature/OriginalFeature/Resources/WebView/`에 있다.

## 맥에 같이 들어가는 코드

- `Core`, `DesignSystem` 모듈과, 맥 Safari 확장이 소스째 컴파일하는 `Projects/App/SafariExtension/`, `Projects/Core/Sources/`가 맥 빌드에 들어간다. 이곳을 고치면 `TapTap`과 `TapTapMac`을 둘 다 빌드한다. `Shared`와 `AnalyticsKit`은 iOS 전용이다.
- 이 경로의 Swift 파일에서 다른 모듈을 import하면 `Article.swift`처럼 `#if os(iOS)`로 감싼다.
- 확장 스크립트는 터치 경로(`touchend`)와 마우스 경로(`dblclick`, `mouseup`)를 함께 유지한다.

## PR

- 제목은 `✨ Feat: 요약`처럼 Gitmoji, 대문자 타입, 한국어 요약으로 쓴다. 개발 레포에는 이슈를 두지 않으니 이슈 번호는 넣지 않는다.
- 본문은 `.github/PULL_REQUEST_TEMPLATE.md`의 절을 채운다. 관련 이슈 칸에는 spec 경로를, 테스트와 검증 칸에는 완료 조건별 결과를 쓰고, 끝에 「홍이 확인할 것」을 둔다. 템플릿의 예시 문장은 지운다.
- 제목과 본문을 홍에게 먼저 보여 주고, 확인받으면 `gh pr create --base develop --assignee dbsghdz1 --label <타입 라벨>`로 연다. 라벨은 `✨ Feature`, `🔨 Fix`, `📂 Chore`, `📄 Docs`처럼 레포에 있는 것을 쓴다.

## 계측

- 이벤트 정의의 정본은 코드다. 앱 이벤트는 `Projects/AnalyticsKit/Sources/Event/`, 확장 이벤트는 `Projects/App/SafariExtension/Resources/analytics.js`와 `Projects/App/ShareExtension/Sources/ShareViewController.swift`의 문자열이다. 이벤트를 바꾸면 해당 spec 「설계」 절의 이벤트 표도 같이 고친다.
- 전환 이벤트(`ConversionEvent`)는 동작이 실제로 성공한 뒤에 보낸다. 탭 시점에 보내면 실패한 시도가 전환으로 세어진다.
- 온보딩 단계 이벤트는 화면 진입(`.onAppear`) 시점에 보낸다. 단계를 더하거나 순서를 바꾸면 `step_index`와 `step_name`도 같이 고친다.
- 이벤트 속성에는 코드에 정해진 값(화면, 단계, 종류)과 개수, 길이만 싣는다. 검색어, 페이지 주소, 본문은 싣지 않는다.
- Safari 확장과 공유 시트의 이벤트는 `ExtensionAnalyticsQueue`(App Group, 최근 200건)에 쌓였다가, iOS 앱이 시작하거나 포그라운드로 올 때 `AppDelegate.deliverPendingExtensionEvents`가 보낸다. 맥 앱은 큐를 비우지 않는다. 확장 이벤트에 Bool이나 숫자 속성을 더하면 `ExtensionEvent.typedValue`에도 넣는다.

## Safari 확장

- 스크립트는 `Projects/App/SafariExtension/Resources/` 바로 아래에 있고, 번들러 없이 `manifest.json`의 `content_scripts` 순서대로 실린다.
- 새 스크립트는 `analytics.js`처럼 `window.TapTap = window.TapTap || {};`로 시작해 `window.TapTap.이름`에 모듈을 붙이고 `content_scripts`에 넣는다. 초기화가 필요하면 `bootstrap.js`의 `initializeWhenReady`에 더한다. CSS는 `web_accessible_resources`에도 넣는다.
- 하위 폴더에 파일을 두려면 `Projects/App/Project.swift`와 `Projects/TapTapMac/Project.swift`의 리소스 목록을 같이 고친다.

## 릴리스

- 릴리스는 로컬 Mac에서 `TapTap/`의 fastlane 레인으로 한다. TestFlight는 `fastlane ios beta version:X.Y.Z`, App Store 업로드는 `fastlane ios appstore version:X.Y.Z`다. `version:`을 빼면 입력을 기다리며 멈춘다. `ios release`는 인증서만 받는다.
- 로컬에서는 `bundle exec`를 붙이지 않는다. 붙이면 RUBYOPT가 xcodebuild로 새어 아카이브가 실패한다.
- 레인이 버전과 빌드 번호를 `Project.xcconfig`에 직접 쓴다. 버전 올리기는 커밋할 거리가 아니다.
- `appstore` 레인은 빌드 번호를 올려 새로 빌드하고 `fastlane/metadata/`의 스토어 문구를 같이 올린다. 실기기에서 확인한 TestFlight 빌드와 다른 바이너리이고, 심사 제출은 하지 않는다. 1.2.2는 `skip_screenshots:true`를 붙여 올렸다.
- `fastlane/metadata/`의 문구 수정은 PR로 올리고, 스토어 반영은 홍이 지시했을 때 한다.
- CI(`.github/workflows/iOS.yml`)는 개발 레포에서 꺼져 있고 시크릿이 없다. 켜면 `main` push에 TestFlight 업로드, `v*` 태그에 App Store 업로드가 돈다. `main` 병합과 태그는 홍이 지시할 때만 한다.
