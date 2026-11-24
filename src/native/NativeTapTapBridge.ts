import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type AppInfo = {
  version: string;
};

export interface Spec extends TurboModule {
  getAppInfo(): Promise<AppInfo>;
  navigate(route: string): Promise<void>;
  goBack(): void;
  trackSettingRowTapped(row: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('TapTapBridge');
