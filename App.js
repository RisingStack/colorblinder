import React, { Component } from 'react'
import { AppLoading, Font } from 'expo';
import Routes from './screens/Routes'

class App extends Component {
  state = {
    isFontLoaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'dogbyte': require('./assets/fonts/dogbyte.otf'),
    });
    this.setState({ isFontLoaded: true })
  }

  render() {
    if(!this.state.isFontLoaded) {
      return <AppLoading />
    } else {
      return <Routes />
    }
  }
}

export default App;
