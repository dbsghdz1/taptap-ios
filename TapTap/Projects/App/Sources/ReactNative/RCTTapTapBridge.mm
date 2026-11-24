#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React_RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <TapTapBridgeSpec/TapTapBridgeSpec.h>

#import "TapTap-Swift.h"

@interface RCTTapTapBridge : NSObject <NativeTapTapBridgeSpec>
@end

@implementation RCTTapTapBridge

+ (NSString *)moduleName
{
  return @"TapTapBridge";
}

- (void)getAppInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [ReactNativeBridgeHandler loadAppInfoWithCompletion:^(NSDictionary<NSString *, NSString *> *info, NSString *code, NSString *message) {
    if (code != nil) {
      reject(code, message, nil);
      return;
    }
    resolve(info);
  }];
}

- (void)navigate:(NSString *)route resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [ReactNativeBridgeHandler navigateWithRoute:route completion:^(NSString *code, NSString *message) {
    if (code != nil) {
      reject(code, message, nil);
      return;
    }
    resolve(nil);
  }];
}

- (void)goBack
{
  [ReactNativeBridgeHandler goBack];
}

- (void)trackSettingRowTapped:(NSString *)row
{
  [ReactNativeBridgeHandler trackSettingRowTapped:row];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeTapTapBridgeSpecJSI>(params);
}

@end
