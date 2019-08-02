import { StyleSheet } from 'react-native';
import * as Colors from './colors';


export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#20D00D',
};

export default StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  TextStyle: {
    fontSize: 25,
    textAlign: 'center',
  },


  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollview: {
    flex: 1,
  },
  title: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleDark: {
    color: colors.black,
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  slider: {
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  emptyJob:
  {
    flexDirection: 'column',
    width: '70%',
    height: 300,
    backgroundColor: Colors.grey5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grey4,
    borderWidth: 2,
    marginTop: 20,
  },
});
