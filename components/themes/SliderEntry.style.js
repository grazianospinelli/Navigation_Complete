import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';
import * as Colors from './colors';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.35;
const slideWidth = wp(65);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({

  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
  },

  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    // backgroundColor: 'white',
    borderRadius: entryBorderRadius,
  },
  textContainer1: {
    backgroundColor: Colors.primary,
  },
  textContainer2: {
    backgroundColor: Colors.secondary,
  },
  textContainer3: {
    backgroundColor: Colors.tertiary,
  },
  textContainer4: {
    backgroundColor: Colors.quaternary,
  },

  title: {
    color: colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 6,
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic',
  },


});
