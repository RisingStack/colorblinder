import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { Header } from "../../components";
import { generateRGB, mutateRGB } from "../../utilities";
import styles from "./styles";

export default class Home extends Component {
  state = {
    points: 0,
    timeLeft: 0,
    rgb: generateRGB(),
    size: 2
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      this.setState({ timeLeft: this.state.timeLeft - 1 });
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
    if(rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.setState({ points: points + 1, timeLeft: timeLeft + 3 });
      this.generateNewRound();
    } else {
      // wrong tile
      this.setState({ timeLeft: timeLeft - 1 });
    }
  }

  render() {
    const { rgb, size, diffTileIndex, diffTileColor } = this.state;
    const { height } = Dimensions.get("window");
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
          {Array(size)
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
                        rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]
                            ? diffTileColor
                            : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                        margin: 2
                      }}
                      onPress={() => this.onTilePress(rowIndex, columnIndex)}
                    />
                  ))}
              </View>
            ))}
        </View>
      </View>
    );
  }
}
