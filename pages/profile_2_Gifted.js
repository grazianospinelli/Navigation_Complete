/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text, ScrollView, TouchableOpacity, AsyncStorage, DatePickerAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form';
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
      dataSource:[],
      formData:{
        name: 'Pier',
        tos: false,
      },
      dateOfBirth: ''
     };
  }
  
  static navigationOptions = {
    drawerLabel: "Profilo",
    drawerIcon: () =>(
    <Icon  name="user" size={20} color={Colors.secondary} />
    )
  }

  handleValueChange(values) {
    console.log('handleValueChange', values)
    this.setState({ formData: values })
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
      const { name, tos, gender } = this.state.formData;
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
                  </View>
                </View>
                  
                  <GiftedForm
                    formName='signupForm'
                    openModal={(route) => { this.props.navigator.push(route) }}
                    onValueChange={this.handleValueChange.bind(this)}
                    
                  >

                    <GiftedForm.SeparatorWidget />

                   
                    <GiftedForm.TextInputWidget
                      name='fullName'
                      title='Full name'
                      placeholder='Marco Polo'
                      clearButtonMode='while-editing'
                      value={name}
                    />
                   

                    <GiftedForm.TextInputWidget
                      name='Cognome' // mandatory
                      title='Cognome'
                      // resizeMode="contain"
                      image={<Icon name='user'  /> }
                      placeholder='Marco Polo'
                      clearButtonMode='while-editing'
                    />

                    <GiftedForm.RowValueWidget
                      title='Date of birth'
                      name='dateOfBirth' // mandatory
                      displayValue='dateOfBirth'
                      // resizeMode="contain"
                      image={<Icon name='calendar'  /> }
                      value={this.state.dateOfBirth}
                      onPress={() => {
                        DatePickerAndroid.open({
                          date: (this.state.dateOfBirth)? Date.parse(this.state.dateOfBirth): new Date(),
                          maxDate: new Date(),
                          mode: 'spinner',
                        }).then((r)=>{
                          if (r.action !== DatePickerAndroid.dismissedAction) {
                                          // Selected year, month (0-11), day
                          this.setState({dateOfBirth:`${r.month}/${r.day}/${r.year}`});
                        }
                        }).catch((code,message)=>console.warn('Cannot open date picker', message));
                    }}
                    />
                    
                    {/* <GiftedForm.ModalWidget
                        title='Biography'
                        displayValue='bio'
                        resizeMode="contain"
                        image={<Icon name='user'  />}
                        

                        scrollEnabled={true} // true by default
                      >
                        <GiftedForm.SeparatorWidget/>
                        <GiftedForm.TextAreaWidget
                          name='bio'                        
                          autoFocus={true}

                          placeholder='Something interesting about yourself'
                        />
                    </GiftedForm.ModalWidget> */}

                    <GiftedForm.SeparatorWidget />



                    <GiftedForm.HiddenWidget name='tos' value={tos} />
                  </GiftedForm>
                             
                    <TouchableOpacity style={styles.buttonContainer}>
                      <Text style={{color: '#fff'}}>Salva Profilo</Text> 
                    </TouchableOpacity>
                  
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
    padding:10,
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

  // loader:{
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#fff"
  //  },
  
  // pageName: {
  //   margin: 10,
  //   fontWeight: 'bold',
  //   color: '#000',
  //   textAlign: 'center',
  // },


});
