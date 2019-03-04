import { StyleSheet } from 'react-native';
import { scale } from '../../utilities';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pausedText: {
    fontFamily: 'dogbyte',
    textAlign: 'center',
    color: '#eee',
    marginTop: 20,
    fontSize: scale(55),
  },
  pausedIcon: {
    width: scale(75),
    height: scale(75),
  },
  exitIcon: {
    marginTop: 20,
    width: scale(90),
    height: scale(45),
  },
});
