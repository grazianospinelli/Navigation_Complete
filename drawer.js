import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import NavBarItem from './components/common/NavBarItem';
import DrawerContainer from './components/DrawerContainer';
import ProfileScreen from './pages/profile';
import OfferScreen from './pages/offers';
import JobScreen from './pages/impegni';
// import MessageScreen from './pages/messages';
import MessNavStack from './pages/messagestack';
import AgendaScreen from './pages/agenda';
import LogoutScreen from './pages/logout';
import * as Colors from './components/themes/colors';

const getDrawerItem = navigation => (
  <NavBarItem
    iconName = "bars"
    onPress={() => {
      // console.log(navigation.state);
      if (!navigation.state.isDrawerOpen) {
        navigation.openDrawer();
      } else {
        navigation.closeDrawer();
      }
    }}
  />
);

const Drawer = createDrawerNavigator(
  {
    Profile:  { screen: ProfileScreen },
    Offers:   { screen: OfferScreen },
    Job:      { screen: JobScreen },    
    Agenda:   { screen: AgendaScreen },    
    Message:  { 
      screen: MessNavStack,
      navigationOptions: {
        drawerLabel: "Messaggi",
        drawerIcon: () =>(<Icon  name="bubble" size={20} color={Colors.secondary} />)                  
      }
    },
    Logout:   { screen: LogoutScreen },
  },

  {
    contentComponent: DrawerContainer,
    drawerWidth: 300,
    drawerPosition: 'left',
    contentOptions: {
      style: {
        backgroundColor: 'black',
        flex: 1
      },
      activeBackgroundColor: Colors.primary,
      itemsContainerStyle: {
        marginVertical: 0,
      },
      iconContainerStyle: {
        opacity: 5
      },
      itemStyle :{
        height : 50,
        borderBottomWidth: 1,      
        borderBottomColor: Colors.secondary
      }
    },
    initialRouteName: 'Profile',    
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  });


Drawer.navigationOptions = ({ navigation }) => ({
  title: 'Extra Staff',
  headerStyle: {
    height: 52,    
    backgroundColor: 'black',
  },
  headerTitleStyle: {
    fontFamily: 'Wildemount Rough',
    fontWeight:'200',
    marginLeft: 55,
		fontSize: 50,
    color: Colors.primary,
  },
  headerTintColor: Colors.primary,
  headerLeft: getDrawerItem(navigation),
});

export default Drawer;
