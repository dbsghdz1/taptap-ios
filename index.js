import { AppRegistry } from 'react-native';

import OpenSourceListScreen from './src/screens/OpenSourceListScreen';
import SettingScreen from './src/screens/SettingScreen';

AppRegistry.registerComponent('TapTapSetting', () => SettingScreen);
AppRegistry.registerComponent('TapTapOpenSourceList', () => OpenSourceListScreen);
