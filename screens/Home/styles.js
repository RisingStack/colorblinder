import { StyleSheet } from 'react-native';
import { isIphoneX, scale } from '../../utilities';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    fontSize: scale(42),
    fontFamily: 'dogbyte',
    color: '#ecf0f1',
    marginTop: 5,
  },
  playIcon: {
    height: scale(60),
    width: scale(60),
    marginRight: 15,
  },
  leaderboard: {
    fontSize: scale(38),
    fontFamily: 'dogbyte',
    color: '#ecf0f1',
    marginTop: 5,
  },
  leaderboardIcon: {
    height: scale(50),
    width: scale(50),
    marginRight: 15,
  },
  hiscore: {
    fontSize: scale(28),
    fontFamily: 'dogbyte',
    color: '#ecf0f1',
    marginTop: 5,
  },
  trophyIcon: {
    height: scale(45),
    width: scale(45),
    marginRight: 12.5,
  },
  bottomContainer: {
    marginBottom: isIphoneX() ? 0 : '5%',
    marginHorizontal: '5%',
    flexDirection: 'row',
  },
  copyrightText: {
    fontSize: scale(16),
    fontFamily: 'dogbyte',
    marginBottom: 2.5,
  },
  soundIcon: {
    height: scale(35),
    width: scale(35),
  },
});
