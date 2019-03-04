import React, { Component, Fragment } from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo';
import { Header, Grid, BottomBar } from '../../components';
import {
  generateRGB,
  mutateRGB,
  storeData,
  retrieveData,
  shakeAnimation,
} from '../../utilities';
import styles from './styles';

export default class Game extends Component {
  state = {
    points: 0,
    bestPoints: 0, // < new
    timeLeft: 15,
    bestTime: 0, // < new
    rgb: generateRGB(),
    size: 2,
    gameState: 'INGAME', // three possible states: 'INGAME', 'PAUSED' and 'LOST'
    shakeVal: new Animated.Value(0),
  };

  async componentWillMount() {
    this.generateNewRound();
    retrieveData('highScore').then(val => this.setState({ bestPoints: val || 0 }));
    retrieveData('bestTime').then(val => this.setState({ bestTime: val || 0 }));
    const {
      gameState, timeLeft, bestTime, points, bestPoints,
    } = this.state;
    this.interval = setInterval(async () => {
      if (gameState === 'INGAME') {
        if (timeLeft > bestTime) {
          this.setState(state => ({ bestTime: state.timeLeft }));
          storeData('bestTime', timeLeft);
        }
        if (timeLeft <= 0) {
          this.loseFX.replayAsync();
          this.backgroundMusic.stopAsync();
          if (points > bestPoints) {
            this.setState(state => ({ bestPoints: state.points }));
            storeData('highScore', points);
          }
          this.setState({ gameState: 'LOST' });
        } else {
          this.setState(state => ({ timeLeft: state.timeLeft - 1 }));
        }
      }
    }, 1000);

    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();
    this.tileCorrectFX = new Audio.Sound();
    this.tileWrongFX = new Audio.Sound();
    this.pauseInFX = new Audio.Sound();
    this.pauseOutFX = new Audio.Sound();
    this.loseFX = new Audio.Sound();

    try {
      await this.backgroundMusic.loadAsync(
        require('../../assets/music/Komiku_BattleOfPogs.mp3'),
      );
      await this.buttonFX.loadAsync(require('../../assets/sfx/button.wav'));
      await this.tileCorrectFX.loadAsync(
        require('../../assets/sfx/tile_tap.wav'),
      );
      await this.tileWrongFX.loadAsync(
        require('../../assets/sfx/tile_wrong.wav'),
      );
      await this.pauseInFX.loadAsync(require('../../assets/sfx/pause_in.wav'));
      await this.pauseOutFX.loadAsync(
        require('../../assets/sfx/pause_out.wav'),
      );
      await this.loseFX.loadAsync(require('../../assets/sfx/lose.wav'));

      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateSizeIndex = size => Math.floor(Math.random() * size);

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    const size = Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5);
    this.setState({
      size,
      diffTileIndex: [
        this.generateSizeIndex(size),
        this.generateSizeIndex(size),
      ],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
    });
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft, shakeVal } = this.state;
    if (rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.tileCorrectFX.replayAsync();
      this.setState({ points: points + 1, timeLeft: timeLeft + 2 });
      this.generateNewRound();
    } else {
      // wrong tile
      shakeAnimation(shakeVal);
      this.tileWrongFX.replayAsync();
      this.setState({ timeLeft: timeLeft - 2 });
    }
  };

  onBottomBarPress = async () => {
    const { gameState } = this.state;
    switch (gameState) {
      case 'INGAME': {
        this.pauseInFX.replayAsync();
        this.setState({ gameState: 'PAUSED' });
        break;
      }
      case 'PAUSED': {
        this.pauseOutFX.replayAsync();
        this.setState({ gameState: 'INGAME' });
        break;
      }
      case 'LOST': {
        this.backgroundMusic.replayAsync();
        await this.setState({
          points: 0,
          timeLeft: 15,
          size: 2,
        });
        this.generateNewRound();
        this.setState({
          gameState: 'INGAME',
        });
        break;
      }
      default: {
        return null;
      }
    }
  };

  onExitPress = () => {
    this.backgroundMusic.stopAsync();
    this.props.navigation.goBack();
  };

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      gameState,
      shakeVal,
      points,
      bestPoints,
      timeLeft,
      bestTime,
    } = this.state;
    const { width } = Dimensions.get('window');

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Header />
        </View>
        <View style={{ flex: 5, justifyContent: 'center' }}>
          <Animated.View
            style={{
              height: width * 0.875,
              width: width * 0.875,
              left: shakeVal,
              flexDirection: 'row',
            }}
          >
            {gameState === 'INGAME' ? (
              <Grid
                size={size}
                diffTileIndex={diffTileIndex}
                diffTileColor={diffTileColor}
                rgb={rgb}
                onPress={this.onTilePress}
              />
            ) : (
              <View style={styles.pausedContainer}>
                {gameState === 'PAUSED' ? (
                  <Fragment>
                    <Image
                      source={require('../../assets/icons/mug.png')}
                      style={styles.pausedIcon}
                    />
                    <Text style={styles.pausedText}>COVFEFE BREAK</Text>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Image
                      source={require('../../assets/icons/dead.png')}
                      style={styles.pausedIcon}
                    />
                    <Text style={styles.pausedText}>U DED</Text>
                  </Fragment>
                )}
                <TouchableOpacity onPress={this.onExitPress}>
                  <Image
                    source={require('../../assets/icons/escape.png')}
                    style={styles.exitIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
        <View style={{ flex: 2 }}>
          <BottomBar
            points={points}
            bestPoints={bestPoints}
            timeLeft={timeLeft}
            bestTime={bestTime}
            onBottomBarPress={this.onBottomBarPress}
            gameState={gameState}
          />
        </View>
      </SafeAreaView>
    );
  }
}
