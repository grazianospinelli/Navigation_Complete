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
import IconSwitch from '../components/IconSwitch';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

const sex = [
  {
      label: 'Uomo',
      value: 'U',
  },
  {
      label: 'Donna',
      value: 'D',
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
  telnumber: Yup
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
      myphoto: '',
      loading: true,
      dataSource:[],
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
          // console.log(responseJson);
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

  update = (values) => { 
    const myuuid = this.state.uuid;
    values.uuid = myuuid;
    values.photo = this.state.myphoto;
    console.log(JSON.stringify(values));
    fetch(`${IP}/updateprofile.php`, {
      method: 'POST',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify(values)
      // Affinchè funzioni la comunicazione con gli script PHP ci deve essere corrispondenza
      // tra i nomi dei componenti dell'oggetto values={name:'', ...} e i nomi dei campi del DB remoto
    })
    .then((response) => response.json())
    .then((responseJson) => {alert(responseJson);})
    .catch((error) => {alert(error);});
       
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
                    <Text style={styles.info}>{data['email'] ? data['email'].toLowerCase() : null }</Text>
                      <Card 
                        containerStyle={{width: '100%'}}
                        titleStyle={{padding: 10, backgroundColor: '#cecece'}}
                        title="INFORMAZIONI PERSONALI">
                        
                        <Formik
                          initialValues={{ 
                              // L'operatore !!() converte un valore in Boolean
                              name: data['name'], surname: data['surname'], city: data['city'], 
                              telnumber: data['telnumber'], fiscalcode: data['fiscalcode'], birthdate: data['birthdate'],
                              sex: data['sex'], chef: !!(data['chef']), waiter: !!(data['waiter']),
                              barman: !!(data['barman']), sommel: !!(data['sommel']), pulizie: !!(data['pulizie']),
                              animaz: !!(data['animaz']), hostess: !!(data['hostess'])
                          }}
                          // onSubmit={values => alert(JSON.stringify(values))}
                          onSubmit={values => this.update(values)}
                          validationSchema={myvalidationSchema}
                        >

                          {({ values, handleChange, errors, submitCount, setFieldValue, setFieldTouched, touched, isValid, handleSubmit }) => (
                          // Per non far saltare IconTextField ho modificato il database Mysql affinchè il valore di default
                          // all'inserimento di una nuova riga nel DB non sia NULL ma impostato da interfaccia PHPMySql:
                          // Predefinito -> Come Definito: -> campo vuoto
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
                                    value={values.telnumber}
                                    keyboardType='number-pad'
                                    onChangeText={text => setFieldValue("telnumber", text)}
                                    onBlur={() => setFieldTouched("telnumber")}
                                    error={touched.telnumber || submitCount > 0 ? errors.telnumber : null}
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
                                  
                                  <View style={styles.ElemForm}>	
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

                                                                    
                                  <View style={styles.ElemForm}>
                                  <Icon style={{ marginBottom: 15, marginRight: 10 }} size={20} name='ios-female' />
                                  <View style={{ flex: 1, alignItems: 'flex-end' }}> 
                                          <RNPickerSelect
                                              placeholder = {{
                                                label: 'Sesso...',
                                                value: null,
                                                color: 'green',                                                      
                                              }}
                                              value={values.sex}
                                              items={sex}
                                              onValueChange={text => setFieldValue("sex", text)}
                                              onBlur={() => setFieldTouched("sex")}
                                              textInputProps={{ underlineColor: 'red' }}                                                                                       
                                          />
                                    </View>
                                  
                                  </View>

                                  {/* //////////////////////////////////////////////// */}

                                  <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>COMPETENZE PROFESSIONALI</Text> 
                                  </View>
                                  <Divider style={{marginTop: 15, borderColor: 'gray' }} />
                                  
                                  <IconSwitch
                                      label='Cuoco'
                                      iconName='silverware'
                                      onValueChange={(val) => setFieldValue("chef", val)}
                                      value={values.chef}
                                  />

                                  <IconSwitch
                                      label='Cameriere'
                                      iconName='bow-tie'
                                      onValueChange={(val) => setFieldValue("waiter", val)}
                                      value={values.waiter}
                                  />  
                                  
                                  <IconSwitch
                                      label='Sommelier'
                                      iconName='bottle-wine'
                                      onValueChange={(val) => setFieldValue("sommel", val)}
                                      value={values.sommel}
                                  />

                                  <IconSwitch
                                      label='Barman'
                                      iconName='glass-cocktail'
                                      onValueChange={(val) => setFieldValue("barman", val)}
                                      value={values.barman}
                                  />

                                  <IconSwitch
                                      label='Pulizie'
                                      iconName='broom'
                                      onValueChange={(val) => setFieldValue("pulizie", val)}
                                      value={values.pulizie}
                                  />

                                  <IconSwitch
                                      label='Animazione'
                                      iconName='artist'
                                      onValueChange={(val) => setFieldValue("animaz", val)}
                                      value={values.animaz}
                                  />

                                  <IconSwitch
                                      label='Hostess'
                                      iconName='star'
                                      onValueChange={(val) => setFieldValue("hostess", val)}
                                      value={values.hostess}
                                  />
                                  

                                  <View marginTop={15} />
                    
                                  <Button
                                    title='Salva Profilo'
                                    disabled={!isValid}
                                    onPress={handleSubmit}
                                    color={Colors.primary}
                                  />

                                  {/* <TouchableOpacity style={styles.buttonContainer} disabled={!isValid} onPress={handleSubmit} >
                                    <Text style={{color: '#fff'}}>SALVA PROFILO</Text> 
                                  </TouchableOpacity> */}

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
    alignItems: 'center',
  },
  containerscroll: {
    width: '100%',
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
  ElemForm: {
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
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },

});
