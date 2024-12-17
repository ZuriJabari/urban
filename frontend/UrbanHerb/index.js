/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';

// Ensure the component is registered with the exact name
if (!AppRegistry.getAppKeys().includes('TempProject')) {
  AppRegistry.registerComponent('TempProject', () => App);
}
