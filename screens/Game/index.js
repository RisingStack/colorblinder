import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Animated,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import { Audio } from "expo";
import { Header } from "../../components";
import {
  generateRGB,
  mutateRGB,
  storeData,
  retrieveData
} from "../../utilities";
import styles from "./styles";

export default class Game extends Component {
  state = {
    points: 0,
    bestPoints: 0, // < new
    timeLeft: 15,
    bestTime: 0, // < new
    rgb: generateRGB(),
    size: 2,
    gameState: "INGAME", // three possible states: 'INGAME', 'PAUSED' and 'LOST'
    shakeAnimation: new Animated.Value(0)
  };

  async componentWillMount() {
    this.generateNewRound();
    retrieveData("highScore").then(val => this.setState({ bestPoints: val }));
    retrieveData("bestTime").then(val => this.setState({ bestTime: val }));
    this.interval = setInterval(async () => {
      if (this.state.gameState === "INGAME") {
        if (this.state.timeLeft > this.state.bestTime) {
          this.setState(state => ({ bestTime: state.timeLeft }));
          storeData("bestTime", this.state.timeLeft);
        }
        if (this.state.timeLeft <= 0) {
          this.loseFX.replayAsync();
          this.backgroundMusic.stopAsync();
          if (this.state.points > this.state.bestPoints) {
            this.setState(state => ({ bestPoints: state.points }));
            storeData("highScore", this.state.points);
          }
          this.setState({ gameState: "LOST" });
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
        require("../../assets/music/Komiku_BattleOfPogs.mp3")
      );
      await this.buttonFX.loadAsync(require("../../assets/sfx/button.wav"));
      await this.tileCorrectFX.loadAsync(
        require("../../assets/sfx/tile_tap.wav")
      );
      await this.tileWrongFX.loadAsync(
        require("../../assets/sfx/tile_wrong.wav")
      );
      await this.pauseInFX.loadAsync(require("../../assets/sfx/pause_in.wav"));
      await this.pauseOutFX.loadAsync(
        require("../../assets/sfx/pause_out.wav")
      );
      await this.loseFX.loadAsync(require("../../assets/sfx/lose.wav"));

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

  generateSizeIndex = () => {
    return Math.floor(Math.random() * this.state.size);
  };

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    this.setState({
      size: Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5)
    });
    this.setState({
      diffTileIndex: [this.generateSizeIndex(), this.generateSizeIndex()],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB
    });
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft } = this.state;
    if (rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.tileCorrectFX.replayAsync();
      this.setState({ points: points + 1, timeLeft: timeLeft + 2 });
      this.generateNewRound();
    } else {
      // wrong tile
      Animated.sequence([
        Animated.timing(this.state.shakeAnimation, {
          toValue: 50,
          duration: 100
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: -50,
          duration: 100
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: 50,
          duration: 100
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: -50,
          duration: 100
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: 0,
          duration: 100
        })
      ]).start();
      this.tileWrongFX.replayAsync();
      this.setState({ timeLeft: timeLeft - 2 });
    }
  };

  onBottomBarPress = async () => {
    switch (this.state.gameState) {
      case "INGAME": {
        this.pauseInFX.replayAsync();
        this.setState({ gameState: "PAUSED" });
        break;
      }
      case "PAUSED": {
        this.pauseOutFX.replayAsync();
        this.setState({ gameState: "INGAME" });
        break;
      }
      case "LOST": {
        this.backgroundMusic.replayAsync();
        await this.setState({
          points: 0,
          timeLeft: 15,
          size: 2
        });
        this.generateNewRound();
        this.setState({
          gameState: "INGAME"
        });
        break;
      }
    }
  };

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      gameState,
      shakeAnimation
    } = this.state;
    const { height } = Dimensions.get("window");
    const bottomIcon =
      gameState === "INGAME"
        ? require("../../assets/icons/pause.png")
        : gameState === "PAUSED"
        ? require("../../assets/icons/play.png")
        : require("../../assets/icons/replay.png");

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ position: "absolute", top: height / 6 }}>
            <Header />
          </View>
          <Animated.View
            style={{
              height: height / 2.5,
              width: height / 2.5,
              flexDirection: "row",
              left: shakeAnimation
            }}
          >
            {gameState === "INGAME" ? (
              Array(size)
                .fill()
                .map((val, columnIndex) => (
                  <View
                    style={{ flex: 1, flexDirection: "column" }}
                    key={columnIndex}
                  >
                    {Array(size)
                      .fill()
                      .map((val, rowIndex) => (
                        <TouchableOpacity
                          key={`${rowIndex}.${columnIndex}`}
                          style={{
                            flex: 1,
                            backgroundColor:
                              rowIndex == diffTileIndex[0] &&
                              columnIndex == diffTileIndex[1]
                                ? diffTileColor
                                : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                            margin: 2
                          }}
                          onPress={() =>
                            this.onTilePress(rowIndex, columnIndex)
                          }
                        />
                      ))}
                  </View>
                ))
            ) : gameState === "PAUSED" ? (
              <View style={styles.pausedContainer}>
                <Image
                  source={require("../../assets/icons/mug.png")}
                  style={styles.pausedIcon}
                />
                <Text style={styles.pausedText}>COVFEFE BREAK</Text>
              </View>
            ) : (
              <View style={styles.pausedContainer}>
                <Image
                  source={require("../../assets/icons/dead.png")}
                  style={styles.pausedIcon}
                />
                <Text style={styles.pausedText}>U DED</Text>
              </View>
            )}
          </Animated.View>
          <View style={styles.bottomContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.counterCount}>{this.state.points}</Text>
              <Text style={styles.counterLabel}>points</Text>
              <View style={styles.bestContainer}>
                <Image
                  source={require("../../assets/icons/trophy.png")}
                  style={styles.bestIcon}
                />
                <Text style={styles.bestLabel}>{this.state.bestPoints}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={this.onBottomBarPress}
              >
                <Image source={bottomIcon} style={styles.bottomIcon} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.counterCount}>{this.state.timeLeft}</Text>
              <Text style={styles.counterLabel}>seconds left</Text>
              <View style={styles.bestContainer}>
                <Image
                  source={require("../../assets/icons/clock.png")}
                  style={styles.bestIcon}
                />
                <Text style={styles.bestLabel}>{this.state.bestTime}</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
