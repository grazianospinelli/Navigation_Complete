import React, { Component } from 'react';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { onSignOut } from '../components/auth';
import * as Colors from '../components/themes/colors';

export default class LogoutScreen extends Component {
    constructor(props) {
        super(props);
      }

    static navigationOptions = {
        drawerLabel: "Esci",
        drawerIcon: () =>(
        <Icon  name="logout" size={20} color={Colors.secondary} />
        )
    }


  logout = () =>{
    onSignOut();
    this.props.navigation.navigate('Auth')
  };

  componentWillMount() {
    this.logout();
  }
  
  render() {
     return (null);
  }
}