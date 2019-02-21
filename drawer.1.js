import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getNavigationOptionsWithAction, getDrawerNavigationOptions, getDrawerConfig } from './components/utils/navigation';
import NavBarItem from './components/common/NavBarItem';
import ProfileScreen from './pages/profile';
import JobScreen from './pages/impegni';
import * as Colors from './components/themes/colors';

const getDrawerItem = navigation => (
  <NavBarItem
    iconName = "bars"
    onPress={() => {
      console.log(navigation.state);
      if (!navigation.state.isDrawerOpen) {
        navigation.openDrawer();
      } else {
        navigation.closeDrawer();
      }
    }}
  />
);

const getDrawerIcon = (iconName, tintColor) => <Icon name={iconName} size={20} color={tintColor} />;

const homeDrawerIcon = ({ tintColor }) => getDrawerIcon('home', tintColor);
const userDrawerIcon = ({ tintColor }) => getDrawerIcon('user', tintColor);

const homeNavOptions = getDrawerNavigationOptions('Profile', Colors.primary, 'white', homeDrawerIcon);
const userNavOptions = getDrawerNavigationOptions('Impegni', Colors.primary, 'white', userDrawerIcon);

const Drawer = createDrawerNavigator({
  ProfileScreen: { screen: ProfileScreen, navigationOptions: homeNavOptions },
  JobScreen: { screen: JobScreen, navigationOptions: userNavOptions },
}, getDrawerConfig(300, 'left', 'ProfileScreen'));

Drawer.navigationOptions = ({ navigation }) => getNavigationOptionsWithAction('Extra Staff', Colors.primary, 'white', getDrawerItem(navigation));

export default Drawer;
