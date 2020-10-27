import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, AsyncStorage, ScrollView, StyleSheet } from 'react-native';
import {NavigationEvents} from "react-navigation";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
// import FireManager from '../components/firemanager.js';
import firebase from 'react-native-firebase';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

export default class AgendaScreen extends Component {

  constructor(props) {
      super(props);
      
      this.state = {
        uuid: '',
        loading: true,
        // dataSource:[],
        commDate: null,
        offerDate: null,
        light: 'white',
        dayDetail: null,
        dayNote: null,        
      };

      LocaleConfig.locales['it'] = {
        monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
        dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
        dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
      };
      
      LocaleConfig.defaultLocale = 'it';
  }

  static navigationOptions = {
        drawerLabel: "Calendario",
        drawerIcon: () =>(
        <Icon  name="calendar" size={20} color={Colors.secondary} />
      )
  }

  composeDate = (eventDate,type) => {
      if (eventDate=='EMPTY') {
        var obj = [];
      }
      else {
        // Estraiamo l'array delle sole date in base al tipo se commitment oppure joboffer
        // dayArray è un array di oggetti composti da data e luogo di lavoro
        if (type=='comm') {
          var dayArray=eventDate.map((elem)=>{return ({date: elem.comDate, place: elem.resName, note: elem.comNote})});
        } else {
          var dayArray=eventDate.map((elem)=>{return ({date: elem.joDate, place: elem.resName})});
        }
        // componiamo l'oggetto da passare a markedDates di Calendar contente array di date e stile per data
        // key aggiunta e usata per immagazzinare per quella data il luogo di lavoro relativo alla data stessa
        // https://stackoverflow.com/questions/50584554/mark-multiple-dates-dynamically-react-native-wix
        var obj = dayArray.reduce((c, v) => Object.assign(c, {[v.date]: {
                              customStyles: {
                                key: {
                                  place: v.place,
                                  note: v.note,
                                },
                                container: {
                                  // backgroundColor: operatore terziario -> Colors.primary se è impegno
                                  backgroundColor: (type=='comm') ? Colors.primary : Colors.secondary,
                                  elevation: 4
                                },
                                text: {
                                  color: 'white',
                                  fontWeight: 'bold'
                                },
                              },
                            } 
        }), {});
        
      }
      return obj;
  }
  // Formato richiesto da markedDates implementato in composeDate:
  // markedDates={{  
  //   '2018-03-28': {
  //     AGGIUNTA DA ME LA PROPRIETA' KEY
  //     key: {
  //           place: v.place,
  //           note: v.note,
  //     },
  //     customStyles: {
  //       container: {
  //         backgroundColor: Colors.primary oppure Colors.secondary
  //       },
  //       text: {
  //         color: 'black',
  //         fontWeight: 'bold'
  //       },
  //     },
  //   },
  
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
          // console.log(responseJson);
          // this.setState({dataSource: responseJson});
          var commArray=this.composeDate(responseJson,'comm');
          this.setState({ commDate : commArray});
        })
        .catch(error=>console.log(error)) // fetch error

        fetch(`${IP}/loadjoboffers.php`,{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            uuid: userUuid
          })
        })
        .then((response) => response.json())
        .then((responseJson)=> {
          // this.setState({dataSource: responseJson});
          var offerArray=this.composeDate(responseJson,'offer');
          // console.log(offerArray);
          this.setState({ offerDate : offerArray});
          this.setState({loading: false});         
        })
        .catch(error=>console.log(error)) // fetch error


    })
    .catch(error=>console.log(error)) // storage error
  }
  
  componentDidMount() {
    this.fetchData();
    FireManager();    
  }
  
  showDayDetail = (day,dateArray) => {
    if (dateArray[day.dateString]){
      var dayColor = dateArray[day.dateString].customStyles.container.backgroundColor;
      if (dayColor=='#f24f32') {
        var dDetail=` IMPEGNO:  ${dateArray[day.dateString].customStyles.key.place}`;
        var dNote=dateArray[day.dateString].customStyles.key.note
      }
      else {
        var dDetail= ' OFFERTE: '+dateArray[day.dateString].customStyles.key.place
      }            
    }
    else {
      var dDetail= ' GIORNO LIBERO'; 
      var dayColor= Colors.tertiary;
    }
    this.setState({light: dayColor, dayDetail: dDetail, dayNote:dNote});
    setTimeout(() => this.setState({light: 'white', dayDetail: null, dayNote: null}), 1700);
  }
  
  render() {

    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    const unitId = 'ca-app-pub-4641414830745834/6174410009';
    // const unitId = 'ca-app-pub-3940256099942544/2934735716';

    // const unitId =
    //   Platform.OS === 'ios'
    //     ? 'ca-app-pub-7987914246691031/4248107679'
    //     : 'ca-app-pub-7987914246691031/5729668166';

    

        
    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }
    
    // Fusione dei 2 array di oggetti
    const myMarkedDates = {...this.state.offerDate,...this.state.commDate}
    return (

      <ScrollView>
      <View style={{flex: 1, alignItems: "center"}}>
      
        {/* <Image  style={{width: 100, height: 100, marginTop: 10,}} 
                source={require('../components/images/staffextralogo.png')} 
                resizeMode='cover' /> */}

        <Banner
          style={{marginBottom: 30}}
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => {console.log('Advert loaded');}}
          onAdFailedToLoad={(error) => {
            console.log('Advert fail');
            console.log(error.code);
            console.log(error.message);
          }}
        />
        
        <Calendar
          // Date marking style [simple/period/multi-dot/single]. Default = 'simple'
          markingType={'custom'}
          markedDates={myMarkedDates}
          onDayPress={(day) => {this.showDayDetail(day,myMarkedDates)}}
          // onDayPress={(day) => {console.log('CODE:', myMarkedDates[day.dateString].customStyles.key)}}
          theme={{
              backgroundColor: 'green',
              calendarBackground: 'white',
              textSectionTitleColor: 'black',
              todayTextColor: '#00adf5',
              dayTextColor: '#30e000',
              textDisabledColor: '#d9e1e8',
              arrowColor: Colors.primary,
              monthTextColor: 'black',
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 15,
          }}
        />

        <View style={{flex:1, justifyContent: 'flex-end', alignItems: 'center', marginTop: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 30, height: 30, borderRadius: 75, backgroundColor: this.state.light}}></View>
            <Text style={{fontSize: 13}} ellipsizeMode='tail'>{this.state.dayDetail}</Text>            
          </View>
          <Text style={{fontSize: 12, marginHorizontal: 60}} ellipsizeMode='tail'>{this.state.dayNote}</Text>
        </View>



        {/* Per riaggiornare automaticamente la pagina quando la si seleziona da drawer */}
        <NavigationEvents onDidFocus={()=>this.fetchData()} />


        
      </View>
      </ScrollView>

      

      
    );
  }
}


const styles = StyleSheet.create({
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   }
});