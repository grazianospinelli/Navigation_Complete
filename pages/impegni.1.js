import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, ImageBackground, 
  TextInput, Image, Text, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import moment from "moment";
import * as Colors from '../components/themes/colors';
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

export default class JobScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
    };
  }

  static navigationOptions = {
        drawerLabel: "Lista Impegni",
        drawerIcon: () =>(
        <Icon  name="notebook" size={20} color={Colors.secondary} />),
  }

  fetchData = () => {
      
    AsyncStorage.getItem(USER_UUID)
    .then((userUuid) => {
        this.setState({uuid: userUuid});
        fetch(`${IP}/loadcommitments.php`,{
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
          console.log(responseJson);
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

  ModalItem = (item) => {
     alert(item);
  }

  convertDate = (date) => {
    moment(date, 'YYYY-MM-DD', true).isValid();
    return moment(date).format("DD-MM-YYYY");
  }

  render() {

    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
     }
    
    // const listToShow = this.state.dataSource.map((elem,i)=>(
    //   // comID: 2, comDate: "2019-03-01", comTime: "15:20:00", comPay: 80, resName: "Santissimo"
    //   <Text key={i}>{elem.comDate}</Text>
    // ));

             
    return(
    
      <View style={styles.container}>
        <Text style={styles.pageName}>Lista Impegni</Text>
        <ScrollView>
          {
            this.state.dataSource.map((item, key) => (
               <TouchableOpacity key={key} onPress={this.ModalItem.bind(this, item)}>
                 <Text style={styles.TextStyle} > {this.convertDate(item.comDate)} </Text>
                 <Text style={styles.TextStyle} > Ore: {item.comTime} </Text>
                 <Text  style={styles.TextStyle} > Ristorante: {item.resName} </Text>
                 <Text  style={styles.TextStyle} > Indirizzo: {item.resAddress} </Text>
                 <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />
               </TouchableOpacity>
             ))
          }
         </ScrollView>
        <Text style={styles.pageName}></Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageName: {
    margin: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },

   TextStyle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left'
  }



});


// AppRegistry.registerComponent('profile', () => profile);
