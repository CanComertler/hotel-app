import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from 'navigation/bottomTab';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { store } from './redux/store';

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </Provider>
  );
}
