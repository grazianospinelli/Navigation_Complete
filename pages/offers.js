import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, AsyncStorage } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';


export default class OfferScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      // dataSource:[],
      dataSource: null
    };
  }
  
  static navigationOptions = {
    drawerLabel: "Offerte di Lavoro",
    drawerIcon: () =>(
    <Icon  name="briefcase" size={20} color={Colors.secondary} />),
  }


  fetchData = () => {
    AsyncStorage.getItem(USER_UUID)
    .then((userUuid) => {
        this.setState({uuid: userUuid});
        fetch(`${IP}/loadjoboffers.php`,{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            // we will pass our input data to server
            uuid: userUuid
          })
        })
        .then((response) => response.json())
        .then((responseJson)=> {
          // console.log(responseJson);
          this.setState({dataSource: responseJson});
          this.setState({loading: false});
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    })
    .catch(error=>console.log(error))
  }
  
  componentDidMount() {
    this.fetchData();
    FireManager();
  }


  render() {

    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }
                 
    return(
      <View style={styles.container}>
        <ScrollView>
          <Text>{JSON.stringify(this.state.dataSource, null, 2)}</Text>
          </ScrollView>
      </View>
    );
  }
}




const styles = StyleSheet.create({

  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },  

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  TextStyle:{
    fontSize : 25,
     textAlign: 'center'
  }

});