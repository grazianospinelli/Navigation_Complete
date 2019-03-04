/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { Card, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

export default class ProfileScreen extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[]
     };
  }
  
  static navigationOptions = {
    drawerLabel: "Profilo",
    drawerIcon: () =>(
    <Icon  name="user" size={20} color={Colors.secondary} />
    )
  }

  
  fetchData = () => {
      
    AsyncStorage.getItem(USER_UUID)
    .then((userUuid) => {
        this.setState({uuid: userUuid});
        fetch(`${IP}/loadprofile.php`,{
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
          this.setState({
           loading: false,
           dataSource: responseJson
          })
        })
        .catch(error=>console.log(error)) //to catch the errors if any
        
        // onSignIn(this.upperEmail,this.md5Password,UUID,userName);
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
      const data = this.state.dataSource;
      return(
          
        <View style={{ paddingVertical: 20 }}>
          <Card title={data['name']}>
            <View
              style={{
                backgroundColor: '#bcbec1',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 40,
                alignSelf: 'center',
                marginBottom: 20,
              }}
            >
              <Text style={{ color: 'white', fontSize: 28 }}>{data['name'].substring(0,2)}</Text>
              
            </View>
            <Text style={styles.lightText}>{data['email']}</Text>
          </Card>
        
        </View>
        
      )
  }
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
  
  pageName: {
    margin: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },


});
