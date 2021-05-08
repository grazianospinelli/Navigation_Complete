import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';

export default class ExitScreen extends Component {
    constructor(props) {
        super(props);
      }

    static navigationOptions = {
        drawerLabel: "Chiudi",
        drawerIcon: () =>(
        <Icon  name="logout" size={20} color={Colors.secondary} />
        )
    }

  exit = () =>{
    BackHandler.exitApp()    
  };

  componentWillMount() {
    this.exit();
  }
  
  render() {
    // const { navigate } = this.props.navigation;
    return (null);
  }
}