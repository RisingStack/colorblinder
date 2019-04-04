import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import styles from './styles';

const getBottomIcon = (gameState) => {
  if (gameState === 'INGAME') {
    return require('../../assets/icons/pause.png');
  }
  return gameState === 'PAUSED'
    ? require('../../assets/icons/play.png')
    : require('../../assets/icons/replay.png');
};

export const BottomBar = ({
  points,
  bestPoints,
  timeLeft,
  bestTime,
  onBottomBarPress,
  gameState,
}) => (
  <View style={styles.bottomContainer}>
    <View style={styles.bottomSectionContainer}>
      <Text style={styles.counterCount}>{points}</Text>
      <Text style={styles.counterLabel}>points</Text>
      <View style={styles.bestContainer}>
        <Image
          source={require('../../assets/icons/trophy.png')}
          style={styles.bestIcon}
        />
        <Text style={styles.bestLabel}>{bestPoints}</Text>
      </View>
    </View>
    <View style={styles.bottomSectionContainer}>
      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={onBottomBarPress}
      >
        <Image source={getBottomIcon(gameState)} style={styles.bottomIcon} />
      </TouchableOpacity>
    </View>
    <View style={styles.bottomSectionContainer}>
      <Text style={styles.counterCount}>{timeLeft}</Text>
      <Text style={styles.counterLabel}>seconds left</Text>
      <View style={styles.bestContainer}>
        <Image
          source={require('../../assets/icons/clock.png')}
          style={styles.bestIcon}
        />
        <Text style={styles.bestLabel}>{bestTime}</Text>
      </View>
    </View>
  </View>
);
