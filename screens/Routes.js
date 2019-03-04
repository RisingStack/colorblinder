import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import Game from './Game';

const StackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    Game: {
      screen: Game,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

export default createAppContainer(StackNavigator);
