/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App1 from './src/App_Component';
//import App from './App';
// just comment testing for push
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App1);
