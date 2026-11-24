import ProjectDescription
import ProjectDescriptionHelpers

enum Scheme: String {
  case DEV
  case RELEASE
}

let appTarget = Target.target(
  name: Project.appName,
  product: .app,
  infoPlist: .extendingDefault(
    with: [
      "UILaunchScreen": [
        "UIColorName": "",
        "UIImageName": "",
      ],
      "CFBundleDevelopmentRegion": "ko",
      "CFBundleLocalizations": ["ko"],
      "CFBundleVersion": "$(CURRENT_PROJECT_VERSION)",
      "CFBundleDisplayName": "$(INFOPLIST_KEY_CFBundleDisplayName)",
      "CFBundleShortVersionString": "$(MARKETING_VERSION)",
      "ITSAppUsesNonExemptEncryption": false,

      "AMPLITUDE_API_KEY": "$(AMPLITUDE_API_KEY)",
      "MIXPANEL_TOKEN": "$(MIXPANEL_TOKEN)",

      "FirebaseAutomaticScreenReportingEnabled": false,

      "NSAppTransportSecurity": [
        "NSAllowsArbitraryLoads": true
      ],
      "UIBackgroundModes": [
        "audio",
        "remote-notification"
      ],
      "UISupportedInterfaceOrientations": [
        "UIInterfaceOrientationPortrait"
      ],
      "CFBundleURLTypes": [
        [
          "CFBundleURLSchemes": ["nbs"]
        ]
      ]
    ]
  ),
  sources: .sources,
  resources: .default,
  entitlements: .file(path: "App.entitlements"),
  scripts: [
    .post(
      script: """
      set -e
      export PROJECT_ROOT="$SRCROOT/../../.."
      export ENTRY_FILE="index.js"
      WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
      REACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
      /bin/sh -c "\\"$WITH_ENVIRONMENT\\" \\"$REACT_NATIVE_XCODE\\""
      """,
      name: "Bundle React Native code and images",
      basedOnDependencyAnalysis: false
    )
  ],
  dependencies: [
    .safariEx(),
    .actionEx(),
    .addLinkFeature(),
    .homeFeature(),
    .linkDetailFeature(),
    .linkListFeature(),
    .myCategoryFeature(),
    .onboardingFeature(),
    .originalFeature(),
    .searchFeature(),
    .settingFeature(),
    .analyticsKit()
  ],
  xcconfig: .relativeToRoot("Tuist/Config/App.debug.xcconfig"),
  releaseXcconfig: .relativeToRoot("Tuist/Config/App.release.xcconfig")
)

let safariTarget = Target.target(
  name: TargetName.safariExtension.rawValue,
  product: .appExtension,
  infoPlist: .file(path: "SafariExtension/info.plist"),
  sources: [SourceFileGlob(stringLiteral: TargetName.safariExtension.sourcesPath)],
  resources: [
    "SafariExtension/Resources/manifest.json",
    "SafariExtension/Resources/popup.html",
    "SafariExtension/Resources/*.js",
    "SafariExtension/Resources/*.css",
    "SafariExtension/Resources/images/**",
    "SafariExtension/Resources/_locales/**"
  ],
  entitlements: .file(path: "SafariExtension.entitlements"),
  dependencies: [
    .core()
  ]
)

let shareExtensionTarget = Target.target(
  name: TargetName.shareExtension.rawValue,
  product: .appExtension,
  infoPlist: .file(path: "ShareExtension/info.plist"),
  sources: [SourceFileGlob(stringLiteral: TargetName.shareExtension.sourcesPath)],
  resources: [ResourceFileElement(stringLiteral: TargetName.shareExtension.resourcesPath)],
  entitlements: .file(path: "ShareExtension.entitlements"),
  dependencies: [
    .sdk(name: "UniformTypeIdentifiers", type: .framework),
    .designSystem(),
    .core()
  ]
)

let project = Project.project(
  name: Project.appName,
  targets: [
    appTarget,
    safariTarget,
    shareExtensionTarget
  ]
)
