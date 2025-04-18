/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, ImageBackground, 
         Image, Text, TextInput, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Divider } from 'react-native-elements';
// import { TextField, FilledTextField, OutlinedTextField } from 'react-native-material-textfield';
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IconTextField from '../components/IconTextField';
import IconSwitch from '../components/IconSwitch';
import { Rating } from 'react-native-ratings';
import * as Progress from 'react-native-progress';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import PhotoUpload from 'react-native-photo-upload';
// import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

import placeHolder from '../components/images/profile-placeholder.png'
const placeHolderUri = Image.resolveAssetSource(placeHolder).uri

// Unsplash Access Key Inutilizzata
// const accessKeyId='fbgRVwCQFcuwlJRN0v7b33jb5cbWJgIkRzKvfu2seQs'

const sex = [
  {label: 'Uomo', value: 'U'},
  {label: 'Donna', value: 'D'},
];

const languages = [
  {label: 'Nessuna', value: ''},
  {label: 'Arabo', value: 'Arabo'},
  {label: 'Cinese', value: 'Cinese'},
  {label: 'Francese', value: 'Francese'},
  {label: 'Giapponese', value: 'Giapponese'},
  {label: 'Inglese', value: 'Inglese'},
  {label: 'Russo', value: 'Russo'}, 
  {label: 'Spagnolo', value: 'Spagnolo'}, 
  {label: 'Tedesco', value: 'Tedesco'},  
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
  prov: Yup
    .string()
    .required("Inserire la provincia!"),
  city: Yup
    .string()
    .required("Inserire la città!"),    
  telnumber: Yup
    .string()
    .matches(phoneRegExp, { message: 'Numero non valido'}),
  fiscalcode: Yup
    .string()
    .matches(CFRegExp, { message: 'Codice Fiscale non valido'})
    .max(16,"Troppo Lungo")
    .min(16,"Codice Fiscale non valido"),
  // description: Yup
  //   .string()
  //   .max(300,"Troppo Lungo"),
});

const image = { uri: `${IP}/Assets/cover/image${Math.floor(Math.random()*110)}.jpg` };

export default class ProfileScreen extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      uploading: false,
      dataSource:[],
      district:[],
      cities:[],
      profile_image :'',
      // photoJson: null  // usato per verificare download da Unsplash
    };
  }
  
  static navigationOptions = {
    drawerLabel: "Profilo",
    drawerIcon: () =>(
    <Icon  name="ios-person" size={30} color={Colors.secondary} />
    )
  }
   
  
  fetchData = () => {
    this.setState({loading: true}); 

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
          this.setState({dataSource: responseJson});
          if(!!(responseJson['photo'])){
            // Inserito metodo random per evitare che venga caricata ogni volta la cache dell'immagine
            this.setState({profile_image:`${IP}/Profiles/${userUuid}.jpg?${Math.random()}`});
          } 
         
          // Se non si carica la lista delle città non si può popolare il relativo campo del Profilo
          // nel caso in cui la città è già memorizzata nel DB per l'utente
          this.loadCities(responseJson['prov']);
          this.setState({loading: false});         
        })
        .catch(error=>{console.log(error);this.setState({loading: true});})               
    })
    .catch(error=>console.log(error))  
        

    fetch(`${IP}/getDistrict.php`)
    .then(res => res.json())
    .then(resJson => {   
      if(resJson==='KO'){        
        alert('Network Error')}
      else{
        this.setState({district: resJson});
        // console.log(JSON.stringify(resJson));
      }
    })
    .catch(error=>console.log(error));

  }


  // fetchImage = () => {
  //   Usato per scaricare immagine da Unsplash che la fornisce incapsulata in un JSON con altre informazioni tipo l'autore
  //   this.setState({loading: true});
  //   fetch(`https://api.unsplash.com/photos/random/?client_id=${accessKeyId}&collections=79096724`)    
  //   .then((response) => response.json())
  //   .then((responseJson) => {      
  //     this.setState({photoJson: responseJson});
  //     this.setState({loading: false});      
  //   })
  //   .catch(error=>{console.log(error)})
  // }

  componentDidMount() { 
    // this.fetchImage();   
    this.fetchData();
    // FireManager();
  }

  loadCities = prov => {
    if(prov!==''){
      fetch(`${IP}/getCities.php`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          provincia: prov        
        })
      })
      .then(res => res.json())
      .then(resJson => {   
        if(resJson==='KO'){        
          alert('Network Error')}
        else{ 
          // arriva Array[istat,comune,lat,lng]
          this.setState({cities: resJson});
        }
      })
      .catch(error => {alert(error)});
    }
  }

  findCoord = (city,coord) => {
    if(city!==''){
      var elem=this.state.cities.find(x=>((x.comune)===city));
      // eslint-disable-next-line default-case    
      switch(coord) {
      case "lat":      
        return elem.lat
      case "lng":      
        return elem.lng
      }
    }
    return ''
  }

  update = (values) => { 
    this.setState({uploading: true});
    const myuuid = this.state.uuid;
    values.uuid = myuuid;    
    // console.log(JSON.stringify(values));
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
    .then((responseJson) => {setTimeout(()=>{this.setState({uploading: false});alert(responseJson);this.fetchData();}, 2000);})
    .catch((error) => {setTimeout(()=>{this.setState({uploading: false});alert(error)},1500)});
    
      
  }
  // In fase di rilascio verificare tutti gli alert !

  uploadPhoto = (image) => {
    if(image.uri != null) {
      const photoname = `${this.state.uuid}.jpg`;
      // console.log(image);
      const data = new FormData();
      // fileToUpload lo troviamo anche in uploadphoto.php
      // La foto viene salvata come uuid.jpg sul server
      // uuid viene anche usato sul server per aggiornare il campo photo nel DB
      data.append('fileToUpload', {
        uri: image.uri,
        type: 'image/jpeg',
        name: photoname,
      });
    
    fetch(`${IP}/uploadphoto.php`, {
      method: 'post',
      body: data
    })
    .then((response) => response.json())
    .then((responseJson) => { console.log(responseJson); })
    .catch((error) => {alert(error);});
    }
  else { }
  }


  Total(infoUser) {
    return (infoUser.star1+infoUser.star2+infoUser.star3+infoUser.star4+infoUser.star5)
  }

  calcRating(infoUser) {
    var Tot=this.Total(infoUser)
    var Sum=(infoUser.star1+(infoUser.star2*2)+(infoUser.star3*3)+(infoUser.star4*4)+(infoUser.star5*5))
    if (Tot!==0){return (Sum/Tot)}
    return 0
  }

  starRating(value,infoUser){
    var Tot=this.Total(infoUser)
    if (Tot!==0){return (value/Tot)}
    return 0
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
      // console.log(this.state.photoJson);
      // console.log(this.state.profile_image);
      
      return(
        
        <View style={styles.container}>
            <ScrollView style={styles.containerscroll}>

            <View style={{ height: 220, width: '100%' }} >
                <ImageBackground source={image} style={{flex: 1}} resizeMode='cover' >
                {/* {this.state.photoJson ? 
                  (
                  <ImageBackground source={{ uri: this.state.photoJson.urls.regular }} style={{flex: 1}} resizeMode='cover' > */}
                    <PhotoUpload
                      photoPickerTitle='Seleziona la Foto:'
                      onResponse={(image) => this.uploadPhoto(image)}
                    >
                        {(this.state.profile_image==='')?
                          <Image style={styles.avatar} resizeMode='cover' source={{uri: placeHolderUri}} />
                          :
                          <Image style={styles.avatar} resizeMode='cover' source={{uri: this.state.profile_image }} />
                        }
                    </PhotoUpload>
                  </ImageBackground>
                  {/* ) 
                : null } */}
            </View>

                <View style={styles.body}>
                  <View style={styles.bodyContent}>
                    <Text style={styles.name}>{data['name']} {data['surname']}</Text>                    
                    <Text style={styles.info}>{data['email'] ? data['email'].toLowerCase() : null }</Text>
                    {/* <Text style={styles.info}>{'Voto: '+this.calcRating(data)+' su un totale di '+this.Total(data)+' servizi'}</Text> */}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Rating
                        ratingColor='#f1c40f'
                        ratingCount={5}
                        imageSize={30}
                        readonly
                        startingValue={this.calcRating(data)}
                        style={{ marginTop: 8 }}
                        fractions={10}
                      />
                      <Text style={styles.rating}>{this.calcRating(data).toFixed(2)+'/5'}</Text>
                    </View>
                      <Card 
                        containerStyle={{width: '100%'}}
                        titleStyle={{padding: 10, backgroundColor: '#cecece'}}
                        title="INFORMAZIONI PERSONALI">
                        
                        <Formik
                          initialValues={{ 
                              // L'operatore !!() converte un valore in Boolean
                              name: data['name'], surname: data['surname'], city: data['city'], prov: data['prov'],
                              telnumber: data['telnumber'], fiscalcode: data['fiscalcode'], birthdate: data['birthdate'],
                              sex: data['sex'], chef: !!(data['chef']), pizzaman: !!(data['pizzaman']), officer: !!(data['officer']),
                              maitre: !!(data['maitre']), waiter: !!(data['waiter']), bevandist: !!(data['bevandist']),
                              barman: !!(data['barman']), sommel: !!(data['sommel']), pulizie: !!(data['pulizie']),
                              factotum: !!(data['factotum']), animaz: !!(data['animaz']), hostess: !!(data['hostess']),
                              language1: data['language1'], language2: data['language2'],
                              description: data['description'], lon: data['lon'], lat: data['lat']
                          }}
                          // onSubmit={values => alert(JSON.stringify(values))}
                          onSubmit={values => this.update(values)}
                          validationSchema={myvalidationSchema}
                        >
                          
                          {({ values, handleChange, errors, submitCount, setFieldValue, setFieldTouched, touched, isValid, handleSubmit }) => (
                          // https://medium.com/fotontech/react-native-formik-yup-%EF%B8%8F-18465e020ea0 
                          // ^Per uso di Formik+Yup+Fragment.
                          // Invece per non far saltare IconTextField ho modificato il database Mysql affinchè il valore di default
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

                                  <View style={styles.ElemForm}>
                                  <MaterialIcon style={{ marginBottom: 15, marginRight: 10 }} size={20} name='location-city' />
                                  <View style={{ flex: 1, alignItems: 'flex-end' }}> 
                                          <RNPickerSelect
                                              placeholder = {{
                                                label: 'Provincia',
                                                value: '',
                                                // color: 'green',                                                      
                                              }}
                                              value={values.prov}
                                              items={this.state.district.map((option) => ({
                                                      key: option.sigla_province,
                                                      value: option.sigla_province,
                                                      label: option.nome_province}))
                                              }
                                              onValueChange={text =>{setFieldValue("prov", text);this.loadCities(text)}}
                                              onBlur={() => setFieldTouched("prov")}
                                              textInputProps={{ underlineColor: 'red' }}                                                                                       
                                          />
                                    </View>                                  
                                  </View>

                                  <View style={styles.ElemForm}>
                                  <MaterialIcon style={{ marginBottom: 15, marginRight: 10 }} size={20} name='home' />
                                  <View style={{ flex: 1, alignItems: 'flex-end' }}> 
                                          <RNPickerSelect
                                              disabled={values.prov===''}
                                              placeholder = {{
                                                label: 'Città',
                                                value: '',
                                                // color: 'green',                                                      
                                              }}
                                              value={values.city}
                                              items={this.state.cities.map((option) => ({
                                                      key: option.istat,
                                                      value: option.comune,
                                                      label: option.comune}))
                                              }
                                              onValueChange={text => {
                                                  setFieldValue("city", text);
                                                  setFieldValue("lat", this.findCoord(text,"lat"));
                                                  setFieldValue("lon", this.findCoord(text,"lng"));}                                              
                                              }
                                              onBlur={() => setFieldTouched("city")}
                                              textInputProps={{ underlineColor: 'red' }}                                                                                       
                                          />
                                    </View>                                  
                                  </View>


                                  <IconTextField
                                    label="Telefono"
                                    value={values.telnumber}
                                    keyboardType='number-pad'
                                    onChangeText={text => setFieldValue("telnumber", text)}
                                    onBlur={() => setFieldTouched("telnumber")}
                                    error={touched.telnumber || submitCount > 0 ? errors.telnumber : null}
                                    iconName='ios-call'
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

                                  <IconTextField
                                    label="Codice Fiscale"
                                    autoCapitalize='characters'
                                    value={values.fiscalcode}
                                    onChangeText={text => setFieldValue("fiscalcode", text)}
                                    onBlur={() => setFieldTouched("fiscalcode")}
                                    error={touched.fiscalcode || submitCount > 0 ? errors.fiscalcode : null}
                                    iconName='ios-card'
                                  />

                                  {/* //////////////////////////////////////////////// */}

                                  <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>COMPETENZE PROFESSIONALI</Text> 
                                  </View>
                                  <Divider style={{marginTop: 15, borderColor: 'gray' }} />
                                  
                                  <IconSwitch
                                      label='Cuoco'
                                      iconName='silverware-variant'
                                      onValueChange={(val) => setFieldValue("chef", val)}
                                      value={values.chef}
                                  />

                                  <IconSwitch
                                      label='Pizzaiolo'
                                      iconName='pizza'
                                      onValueChange={(val) => setFieldValue("pizzaman", val)}
                                      value={values.pizzaman}
                                  />

                                  <IconSwitch
                                      label='Ufficio/Reception'
                                      iconName='phone-classic'
                                      onValueChange={(val) => setFieldValue("officer", val)}
                                      value={values.officer}
                                  />

                                  <IconSwitch
                                      label='Direttore/Maitre'
                                      iconName='tie'
                                      onValueChange={(val) => setFieldValue("maitre", val)}
                                      value={values.maitre}
                                  />

                                  <IconSwitch
                                      label='Cameriere'
                                      iconName='bow-tie'
                                      onValueChange={(val) => setFieldValue("waiter", val)}
                                      value={values.waiter}
                                  />  
                                  
                                  <IconSwitch
                                      label='Bevandista'
                                      iconName='glass-stange'
                                      onValueChange={(val) => setFieldValue("bevandist", val)}
                                      value={values.bevandist}
                                  />

                                  <IconSwitch
                                      label='Sommelier'
                                      iconName='glass-wine'
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
                                      label='Pulizie/Lavapiatti'
                                      iconName='broom'
                                      onValueChange={(val) => setFieldValue("pulizie", val)}
                                      value={values.pulizie}
                                  />

                                  <IconSwitch
                                      label='Tuttofare'
                                      iconName='wrench'
                                      onValueChange={(val) => setFieldValue("factotum", val)}
                                      value={values.factotum}
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

                                  <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>PARLI BENE ALTRE LINGUE?</Text> 
                                  </View>

                                  <View style={styles.ElemForm}>
                                  <MaterialIcon style={{ marginBottom: 15, marginRight: 10 }} size={20} name='language' />
                                  <View style={{ flex: 1, alignItems: 'flex-end' }}> 
                                          <RNPickerSelect
                                              placeholder = {{
                                                label: 'Lingua...',
                                                value: '',
                                                color: 'green',                                                      
                                              }}
                                              value={values.language1}
                                              items={languages}
                                              onValueChange={text => setFieldValue("language1", text)}
                                              onBlur={() => setFieldTouched("language1")}
                                              textInputProps={{ underlineColor: 'red' }}
                                          />
                                    </View>
                                  </View>

                                  <View style={styles.ElemForm}>
                                  <MaterialIcon style={{ marginBottom: 15, marginRight: 10 }} size={20} name='language' />
                                  <View style={{ flex: 1, alignItems: 'flex-end' }}> 
                                          <RNPickerSelect
                                              placeholder = {{
                                                label: 'Altra Lingua...',
                                                value: '',
                                                color: 'green',                                                      
                                              }}
                                              value={values.language2}
                                              items={languages}
                                              onValueChange={text => setFieldValue("language2", text)}
                                              onBlur={() => setFieldTouched("language2")}
                                              textInputProps={{ underlineColor: 'red' }}
                                          />
                                    </View>
                                  </View>
                                  
                                  <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>SCRIVI DI TE</Text> 
                                  </View>
                                  
                                  <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.TextInputStyleClass}
                                    // label={''}
                                    placeholder='Descrivi te stesso, cosa sai fare, le tue esperienze nel settore'
                                    multiline={true}                                    
                                    // numberOfLines={5}
                                    maxLength={300}
                                    value={values.description}
                                    onChangeText={text => setFieldValue("description", text)}
                                    onBlur={() => setFieldTouched("description")}
                                    error={touched.description || submitCount > 0 ? errors.description : null}
                                  />

                                  <View style={{marginTop: 15, height: 40, width: '100%', alignItems: 'center', justifyContent:'center', backgroundColor: '#cecece'}}> 
                                    <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.grey1}}>LE TUE STATISTICHE</Text> 
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={{fontSize: 14, color: Colors.grey1}}>{'Totale Voti Ricevuti:  '+this.Total(data)}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={{fontSize: 14, color: Colors.grey1}}>{'Media:   '}</Text>
                                    <Rating
                                      ratingColor='#f1c40f'
                                      ratingCount={5}
                                      imageSize={15}
                                      readonly
                                      startingValue={this.calcRating(data)}
                                      fractions={10}
                                    />
                                    <Text style={{fontSize: 14, color: Colors.grey1, marginLeft: 10}}>{this.calcRating(data).toFixed(2)+'/5'}</Text>
                                  </View>
                                  
                                  <View style={styles.statForm}>
                                    <Text style={[styles.statText, {marginRight: 10}]}>{'5 Stelle'}</Text>
                                    <Progress.Bar progress={this.starRating(data.star5,data)} width={150} color='#f1c40f'/>
                                    <Text style={[styles.statText, {marginLeft: 10}]}>{data.star5+' Voti'}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={[styles.statText, {marginRight: 10}]}>{'4 Stelle'}</Text>
                                    <Progress.Bar progress={this.starRating(data.star4,data)} width={150} color='#f1c40f'/>
                                    <Text style={[styles.statText, {marginLeft: 10}]}>{data.star4+' Voti'}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={[styles.statText, {marginRight: 10}]}>{'3 Stelle'}</Text>
                                    <Progress.Bar progress={this.starRating(data.star3,data)} width={150} color='#f1c40f'/>
                                    <Text style={[styles.statText, {marginLeft: 10}]}>{data.star3+' Voti'}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={[styles.statText, {marginRight: 10}]}>{'2 Stelle'}</Text>
                                    <Progress.Bar progress={this.starRating(data.star2,data)} width={150} color='#f1c40f'/>
                                    <Text style={[styles.statText, {marginLeft: 10}]}>{data.star2+' Voti'}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={[styles.statText, {marginRight: 10}]}>{'1 Stelle'}</Text>
                                    <Progress.Bar progress={this.starRating(data.star1,data)} width={150} color='#f1c40f'/>
                                    <Text style={[styles.statText, {marginLeft: 10}]}>{data.star1+' Voti'}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={{fontSize: 14, color: Colors.grey1}}>{'Impegni Accettati:  '+data.totcom}</Text>
                                  </View>
                                  <View style={styles.statForm}>
                                    <Text style={{fontSize: 14, color: Colors.grey1}}>{'Impegni Disdetti:  '+data.canceledcom}</Text>
                                  </View>


                                  <View marginTop={15} />
                                  
                                  {(this.state.uploading)?
                                    <View                                      
                                      backgroundColor={Colors.primary}
                                      elevation={3}
                                    >
                                      <ActivityIndicator size="large" color="#fff"/>
                                    </View>
                                    :
                                    <Button
                                      title='Salva Profilo'
                                      disabled={!isValid}
                                      onPress={handleSubmit}
                                      color={Colors.primary}
                                    />                                                                     
                                  } 

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
  avatar: {
    flex: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "white",
    // marginBottom:10,
    alignSelf:'center',
    // position: 'absolute',
    // marginTop:140
    // marginTop: 30
  },
  ElemForm: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', 
    height: 70,
    borderBottomWidth: .2,
    borderColor: 'gray',
  },
  // name:{
  //   fontSize:22,
  //   color:"#FFFFFF",
  //   fontWeight:'600',
  // },
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
    color: Colors.tertiary,
    marginTop:7
  },
  rating:{
    fontSize:16,
    color:'#f1c40f',
    fontWeight: 'bold',
    marginLeft:5    
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
  statForm: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    height: 30,
    borderBottomWidth: .2,
    borderColor: 'gray',
  },
  statText: {
    fontSize: 12, 
    fontWeight: 'bold', 
    color: Colors.grey1
  },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  TextInputStyleClass:{
    textAlign: 'left',
    height: 150,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#cecece",
    borderRadius: 15 ,
    backgroundColor : "#FFFFFF"
  }
});
