import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator, AsyncStorage, StyleSheet } from 'react-native';
import {NavigationEvents} from "react-navigation";
import { Agenda, Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import FireManager from '../components/firemanager.js';
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
        //Estraiamo l'array delle sole date in base al tipo
        if (type=='comm') {
          var dayArray=eventDate.map((elem)=>{return elem.comDate});
        } else {
          var dayArray=eventDate.map((elem)=>{return elem.joDate});
        }
        //componiamo l'oggetto da passare a markedDates di Calendar contente array di date e stile per data
        var obj = dayArray.reduce((c, v) => Object.assign(c, {[v]: {
                              customStyles: {
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

    
  render() {
    
    
    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }
    
    const myMarkedDates = {...this.state.offerDate,...this.state.commDate}
    return (
      
      <View style={{alignItems: "center"}}>
        <Image style={{width: 100, height: 100, marginTop: 15,}} source={require('../components/images/staffextralogo.png')} resizeMode='cover' />
        
        <Calendar
          // Date marking style [simple/period/multi-dot/single]. Default = 'simple'
          markingType={'custom'}
          markedDates={myMarkedDates}
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
              textDayHeaderFontSize: 15
          }}
        />

        {/* Per riaggiornare automaticamente la pagina quando la si seleziona da drawer */}
        <NavigationEvents onDidFocus={()=>this.fetchData()} />
        
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
   }


});