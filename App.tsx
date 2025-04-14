import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import MyTabs from 'navigation/bottomTab';

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
      
  );
}
