/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, Image, Text, ScrollView, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { Card, Divider } from 'react-native-elements';
import { TextField } from "react-native-material-textfield";
import { Formik } from "formik";
import { handleTextInput } from "react-native-formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IconTextField from '../components/IconTextField';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

const gender = [
  {
      label: 'Uomo',
      value: 'Uomo',
  },
  {
      label: 'Donna',
      value: 'Donna',
  },
];

const phoneRegExp = /^[0-9]{8,15}$/
const CFRegExp = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/
const myvalidationSchema = Yup.object().shape({
  name: Yup
    .string()
    .required("Inserire il nome!")
    .min(2,"Nome non valido")
    .max(40,"Troppo Lungo"),
  surname: Yup
    .string()
    .max(40,"Troppo Lungo"),
  city: Yup
    .string()
    .max(40,"Troppo Lungo"),
  telephone: Yup
    .string()
    .matches(phoneRegExp, { message: 'Numero non valido'}),
  fiscalcode: Yup
    .string()
    .matches(CFRegExp, { message: 'Codice Fiscale non valido'})
    .max(16,"Troppo Lungo")
    .min(16,"Codice Fiscale non valido")
});

export default class ProfileScreen extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
      date: '',
      formData:{}
     };
  }
  
  static navigationOptions = {
    drawerLabel: "Profilo",
    drawerIcon: () =>(
    <Icon  name="ios-person" size={30} color={Colors.secondary} />
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

  login = (values) => { alert(JSON.stringify(values)) }

  
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
                        containerStyle={{width: '100%'}}
                        titleStyle={{padding: 10, backgroundColor: '#cecece'}}
                        title="INFORMAZIONI PERSONALI">
                        
                        <Formik
                          initialValues={{ name: data['name'], surname: 'Spinelli', gender: '', birthdate: '' }}
                          // onSubmit={values => alert(JSON.stringify(values))}
                          onSubmit={values => this.login(values)}
                          validationSchema={myvalidationSchema}
                        >

                          {({ values, handleChange, errors, submitCount, setFieldValue, setFieldTouched, touched, isValid, handleSubmit }) => (
                          
                                <Fragment>

                                    <View>
                                        <IconTextField
                                          label="Nome"
                                          value={values.name}
                                          onChangeText={text => setFieldValue("name", text)}
                                          onBlur={() => setFieldTouched("name")}
                                          error={touched.name || submitCount > 0 ? errors.name : null}
                                          iconName='ios-person'
                                        />
                                        <IconTextField
                                          label="Cognome"
                                          value={values.surname}
                                          onChangeText={text => setFieldValue("surname", text)}
                                          onBlur={() => setFieldTouched("surname")}
                                          error={touched.surname || submitCount > 0 ? errors.surname : null}
                                          iconName='ios-man'
                                        />
                                        <IconTextField
                                          label="Città"
                                          value={values.city}
                                          onChangeText={text => setFieldValue("city", text)}
                                          onBlur={() => setFieldTouched("city")}
                                          error={touched.city || submitCount > 0 ? errors.city : null}
                                          iconName='ios-home'
                                        />
                                        <IconTextField
                                          label="Telefono"
                                          value={values.telephone}
                                          keyboardType='number-pad'
                                          onChangeText={text => setFieldValue("telephone", text)}
                                          onBlur={() => setFieldTouched("telephone")}
                                          error={touched.telephone || submitCount > 0 ? errors.telephone : null}
                                          iconName='ios-call'
                                        />
                                        <IconTextField
                                          label="Codice Fiscale"
                                          autoCapitalize='characters'
                                          value={values.fiscalcode}
                                          onChangeText={text => setFieldValue("fiscalcode", text)}
                                          onBlur={() => setFieldTouched("fiscalcode")}
                                          error={touched.fiscalcode || submitCount > 0 ? errors.fiscalcode : null}
                                          iconName='ios-card'
                                        />
                                        <View paddingVertical={5} />

                                        <View style={styles.inputForm}>	
                                          <Icon style={{
                                                  position: 'absolute',
                                                  top: 15,
                                                  left: 0,
                                                  }} 
                                                size={20} name='ios-female' />
                                          
                                          <View style={{width: '91%'}}> 
                                                <RNPickerSelect
                                                    placeholder = {{
                                                      label: 'Sesso...',
                                                      value: null,
                                                      color: 'green',
                                                    }}
                                                    value={values.gender}
                                                    items={gender}
                                                    onValueChange={text => setFieldValue("gender", text)}
                                                    onBlur={() => setFieldTouched("gender")}
                                                    textInputProps={{ underlineColor: 'red' }}
                                                    style={{position: 'absolute', top: 15, left: 30 }}                                           
                                                />
                                          </View>
                                        </View>
                                        
                                        <View style={styles.DateForm}>	
                                          <MaterialIcon style={{ marginBottom: 10 }} size={20} name='cake' />
                                          <Text style={{marginBottom: 10, marginLeft: 15, fontSize: 16}}>Nascita:</Text> 
                                          
                                          <View style={{flex:1}}> 
                                                <DatePicker
                                                      style={{width:'100%'}}
                                                      date={values.birthdate}
                                                      showIcon={false}
                                                      mode="date"
                                                      placeholder="Inserisci Data"
                                                      androidMode='spinner'
                                                      format="DD-MM-YYYY"
                                                      minDate="01-01-1940"
                                                      maxDate="01-01-2030"
                                                      confirmBtnText="Conferma"
                                                      cancelBtnText="Indietro"
                                                      customStyles={{                                              
                                                        dateInput: { borderWidth: 0, alignItems: 'flex-end' }                                                
                                                      }}
                                                      onDateChange={(date) => setFieldValue("birthdate", date)}
                                                />
                                          </View>
                                        </View>
                                        
                                        <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                          <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>COMPETENZE PROFESSIONALI</Text> 
                                        </View>
                                        <Divider style={{marginTop: 15, marginBottom: 15, borderColor: Colors.grey5 }} />

                                        <View marginTop={140} />
                         
                                  <Button
                                    title='Salva Profilo'
                                    disabled={!isValid}
                                    onPress={handleSubmit}
                                    color={Colors.primary}
                                  />

                                  <TouchableOpacity style={styles.buttonContainer} disabled={!isValid} onPress={handleSubmit} >
                                   <Text style={{color: '#fff'}}>SALVA PROFILO</Text> 
                                  </TouchableOpacity>

                                  </View>
                                </Fragment>
                          )}
                        </Formik>



                      </Card>                     
                                       
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
  inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: .2,
    borderColor: 'gray',
    width: '100%',    
  },
  DateForm: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', 
    height: 70,
    borderBottomWidth: .2,
    borderColor: 'gray',
    
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
    width: '100%',
    borderRadius:30,    
    backgroundColor: Colors.primary
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
