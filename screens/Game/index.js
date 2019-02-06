import React, { Component } from "react";
import { View, Dimensions, Text, Image, TouchableOpacity } from "react-native";
import { Header } from "../../components";
import { generateRGB, mutateRGB } from "../../utilities";
import styles from "./styles";

export default class Home extends Component {
  state = {
    points: 0,
    timeLeft: 5,
    rgb: generateRGB(),
    size: 2,
    gameState: "INGAME" // three possible states: 'INGAME', 'PAUSED' and 'LOST'
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      if (this.state.gameState === "INGAME") {
        if (this.state.timeLeft === 0) {
          this.setState({ gameState: "LOST" });
        } else {
          this.setState({ timeLeft: this.state.timeLeft - 1 });
        }
      }
    }, 1000);
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
      diffTileIndex: [this.generateSizeIndex(), this.generateSizeIndex()],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
      size: Math.min(Math.max(Math.round(Math.sqrt(points)), 2), 4)
    });
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft } = this.state;
    if (rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.setState({ points: points + 1, timeLeft: timeLeft + 3 });
      this.generateNewRound();
    } else {
      // wrong tile
      this.setState({ timeLeft: timeLeft - 1 });
    }
  };

  onBottomBarPress = () => {
    switch (this.state.gameState) {
      case "INGAME": {
        this.setState({ gameState: "PAUSED" });
        break;
      }
      case "PAUSED": {
        this.setState({ gameState: "INGAME" });
        break;
      }
      case "LOST": {
        this.setState({
          gameState: "INGAME",
          points: 0,
          timeLeft: 15,
          size: 2
        });
        break;
      }
    }
  };

  render() {
    const { rgb, size, diffTileIndex, diffTileColor, gameState } = this.state;
    const { height } = Dimensions.get("window");
    const bottomIcon =
      gameState === "INGAME"
        ? require("../../assets/icons/pause.png")
        : gameState === "PAUSED"
        ? require("../../assets/icons/play.png")
        : require("../../assets/icons/replay.png");

    return (
      <View style={styles.container}>
        <Header />
        <View
          style={{
            height: height / 2.5,
            width: height / 2.5,
            flexDirection: "row"
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
                        onPress={() => this.onTilePress(rowIndex, columnIndex)}
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
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.counterCount}>{this.state.points}</Text>
            <Text style={styles.counterLabel}>points</Text>
            <View style={styles.bestContainer}>
              <Image
                source={require("../../assets/icons/trophy.png")}
                style={styles.bestIcon}
              />
              <Text style={styles.bestLabel}>0</Text>
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
              <Text style={styles.bestLabel}>0</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
