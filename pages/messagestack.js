/* eslint-disable linebreak-style */
import { createStackNavigator } from 'react-navigation';
import MessageScreen from './messages';
import ChatScreen from './chat';

const MessNavStack = createStackNavigator(
  {
    Message: {
      screen: MessageScreen,
      navigationOptions: { header: null },
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: { header: null },
    },
  },
  {
    initialRouteName: 'Message',
    navigationOptions: { header: null },
  },
);

export default MessNavStack;
