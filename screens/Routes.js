import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "./Home";

const StackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

export default createAppContainer(StackNavigator);
