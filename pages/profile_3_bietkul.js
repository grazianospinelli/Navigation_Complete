/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { Card } from 'react-native-elements';
import GenerateForm from 'react-native-form-builder';
import theme from '../form-theme';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

// Modifiche apportate in:
// C:\Users\graziano.spinelli\UserLog-Navigation\node_modules\react-native-form-builder\src\fields
// Per il componente date dove non era attivato lo spinner sulle date
// Per il componente switch dove ho cambiato il colore

const fields = [
  {
    type: 'text',
    name: 'name',
    required: true,
    icon: 'ios-person',
    label: 'Nome',
    
  },
  {
    type: 'text',
    name: 'cognome',
    required: true,
    icon: 'ios-man',
    label: 'Cognome',
    iconOrientation: 'left',
    editable: true,
  },
  {
    type: 'number',
    name: 'telephone',
    label: 'Telefono',
    icon: 'ios-call',
  },
  {
    type: 'date',
    mode: 'date', // 'time', 'datetime'
    icon: 'ios-calendar',
    name: 'birthday',
    label: 'Compleanno',
    maxDate: new Date(2018, 1, 1),
  },
  {
    type: 'select', // required
    name: 'sex', // required
    label: 'Sesso', // required
    options: ['', 'Uomo', 'Donna'],
    defaultValue: ['Happy'],
  },
  {
    type: 'text',
    name: 'filler',
    editable: false,
    props: {
      style: {height: 20, backgroundColor: '#cecece'}
    },
  },
  {
    type: 'switch',
    name: 'Cuoco',
    label: 'Cuoco',
    defaultValue: true,
  },
  {
    type: 'switch',
    name: 'Cameriere',
    label: 'Cameriere',
    defaultValue: true,
  },
  {
    type: 'switch',
    name: 'Sommelier',
    label: 'Sommelier',
    defaultValue: true,
  },
  {
    type: 'switch',
    name: 'Barman',
    label: 'Barman',
    defaultValue: true,
  },
];



export default class ProfileScreen extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
      formData:{}
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

  login() {
    // var form = this.refs['myForm'];
    // const formValues = form.getValues();
    const formValues = this.formGenerator.getValues();
    alert('FORM VALUES', formValues);
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
      if(data['photo']){
        profile_image=`${IP}/Profiles/${this.state.uuid}.png`
      } else {
        profile_image=`${IP}/Profiles/profile-placeholder.png`
      }
      // alert(profile_image);
      
      return(
        
        <View style={styles.container}>
            <ScrollView style={styles.containerscroll}>
                <Image style={{ height: 200, width: '100%' }} source={require('../components/images/saltpepper.jpg')} resizeMode='cover' />
                
                <Image style={styles.avatar} source={{uri: `${profile_image}` }}/>
                <View style={styles.body}>
                  <View style={styles.bodyContent}>
                    <Text style={styles.name}>{data['name']} {data['surname']}</Text>
                    <Text style={styles.info}>{data['email'].toLowerCase()}</Text>
                      <Card 
                        containerStyle={{width: '110%'}}
                        titleStyle={{padding: 10, backgroundColor: '#cecece'}}
                        title="INFORMAZIONI PERSONALI">
                        <View>
                          <GenerateForm
                            ref={(c) => {
                              this.formGenerator = c;
                            }}
                            // ref='myForm'
                            theme = {theme}
                            fields={fields}
                          />
                        </View>


                      </Card>                     
                              
                    <TouchableOpacity style={styles.buttonContainer} onPress={this.login}>
                      <Text style={{color: '#fff'}}>Salva Profilo</Text> 
                    </TouchableOpacity>
                  </View>
                </View>
            </ScrollView>
        </View>

   
      )
  }
}


const styles = StyleSheet.create({

   container: {
    // display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
  },

  containerscroll: {
    width: '100%',
    // flex: 1,
    // display: 'flex',
    // alignItems: 'center',
  },


  header:{
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: Colors.secondary,
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: Colors.primary,
  },


  // container: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
  
  // pageName: {
  //   margin: 10,
  //   fontWeight: 'bold',
  //   color: '#000',
  //   textAlign: 'center',
  // },


});
