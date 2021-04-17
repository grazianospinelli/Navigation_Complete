import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import Dialog from "react-native-dialog";
import {getWeekDay, getYear, getMonth} from './DateUtility';
import Icon from "react-native-vector-icons/Ionicons";
import * as Colors from './themes/colors';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

// Trasformato DateDetail da funzione a classe Componente
// Quando si costruisce un componente avente delle proprietà, 
// bisogna richiamare super(props) nel costruttore prima di ogni altra operazione!
// nel metodo render() le props si richiamano con this.props.

const Separator = (colorSep) => (
    <View style={{width: '80%', height: 2, backgroundColor: colorSep, marginVertical: 15 }} />
);

export default class DateDetail extends Component {

  constructor(props){
    super(props)
    this.state={
      showAlert: false,
      showSendMess: false,
      newMessage: '',
      restaurantImage: null
    }
    modalContent = null;
  }

  handleOpenSendMess = () => {
    this.setState({ showSendMess: true })
  }

  handleCloseSendMess = () => {
    this.setState({ showSendMess: false })
  }

  handleSendMessage = () => {
    const {selectedDate: { comDate, resUUID }} = this.props;
    var message = this.state.newMessage;
		if (message) {
      AsyncStorage.getItem(USER_UUID)
      .then((userUUID) => {
        fetch(`${IP}/setMessages.php`,{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            touuid: resUUID,
            fromuuid: userUUID,
            date: comDate,
            text: message					
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          // console.log(responseData); 
          this.setState({ showSendMess: false });
          this.setState({ newMessage: ''})
        })
        .catch(error=>console.log(error)) // network error
      })
      .catch(error=>console.log(error)) // storage error    
    }
  }
  
  handleOpenAlert = () => {
    this.setState({ showAlert: true })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  handleDeleteAlert = () => {
      const {selectedDate: { comID }} = this.props; // Doppio destructuring
      
      AsyncStorage.getItem(USER_UUID)
      .then((userUUID) => {
      fetch(`${IP}/delcommitments.php`,{
        method:'post',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          id: comID,
          uuid: userUUID
        })
      })
      .then((response) => response.json())
      .then((responseJson)=> {
        // alert(responseJson);
        if (responseJson == 'OK') {
          
          alert('Lista impegni aggiornata');
          this.props.onItemDeleted();
          this.setState({showAlert: false});
          
        }
        else {alert('Errore aggiornamento lista impegni')}
      })
      .catch(error=>console.log(error)) // network error    
      // this.props.onItemDeleted();
      // this.setState({showAlert: false});
    })
    .catch(error=>console.log(error)) // storage error  
         
  }

  
  render() {
    if (this.props.selectedDate) {
      const {selectedDate: { comID, comDate, comTime, comPay, comMansion, comNote, resUUID, resName, resAddress, resCity, resProv, resTel, resTel2, resPhoto }} = this.props;
      var currentDate=new Date();
      var jobDate=new Date(comDate);
      jobDate.setDate(jobDate.getDate() + 1);
      if(!!(resPhoto)){
        restaurantImage=`${IP}/Profiles/${resUUID}.jpg`
      } else {
        restaurantImage=`${IP}/Profiles/restaurant-placeholder.jpg`
      }
      
      switch((comID % 4)) {
        case(0):
        var caseStyle=Colors.primary;
        break;
        case(1):
        var caseStyle='#00d6d6';
        break;
        case(2):
        var caseStyle='#fc8803';
        break;
        case(3):
        var caseStyle=Colors.quaternary;
        break;        
    }
    
      modalContent = (
        <View style={{alignItems: 'center'}}>
          <View style={styles.dateName}>
              <Text style={{fontSize: 15, color: caseStyle}}> {getWeekDay(comDate)} </Text>
              <Text style={{fontSize: 20, color: caseStyle}}> {comDate.split('-')[2]+' '}</Text>
              <Text style={{fontSize: 20, color: caseStyle}}>
                  {getMonth(comDate)+' '+ getYear(comDate)}
              </Text>
          </View>
        
          <View style={[styles.Ribbon, {backgroundColor: caseStyle}]}>
              <Text style={styles.title} numberOfLines={2}> {resName} </Text>
              { resName!=='Impegno Personale' ? 
                (<Fragment>
                  <Image style={styles.avatar} resizeMode='cover' source={{uri: `${restaurantImage}` }}/>
                  <Text style={styles.subtitle} numberOfLines={2}> {resAddress} </Text>
                  <Text style={styles.subtitle}> {resCity+' - ('}
                  {resProv?resProv:'--'}{')'} </Text>                       
                  <Text style={styles.subtitle}>{'Tel: '+resTel}</Text>
                  {resTel2?<Text style={styles.subtitle}>{'Tel: '+resTel2}</Text>:null}
                </Fragment>) : null
              }
          </View>

          <View style={styles.showOffer}>
                        {(comMansion)?<Text style={[styles.notes, {fontSize: 15, fontWeight: 'bold', marginBottom: 5}]}>{comMansion.toUpperCase()}</Text>:null}
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>ORE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{comTime.substr(0,5)}</Text>                            
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>PAGA: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{comPay}{' €'}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>NOTE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic'}]} numberOfLines={5} ellipsizeMode='tail'>{comNote?comNote:'  - - -'}</Text>
                        </View>
          </View>
          { resName!=='Impegno Personale' &&
            <TouchableOpacity 
                disabled={(jobDate<currentDate)} 
                onPress={this.handleOpenSendMess} 
                style={[styles.sendButton, jobDate>=currentDate ? styles.btnActive : styles.btnInActive]}>
                <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>{'INVIA MESSAGGIO'}</Text>
            </TouchableOpacity> }
          {Separator(caseStyle)}               
          
        </View>
      );
      
    }


    return (

      <Fragment>        

        <Modal
          onRequestClose={this.props.onModalClosed}
          supportedOrientations={['portrait', 'landscape']}
          isVisible={this.props.selectedDate !== null}
          // animationIn="flipInY"
          animationIn="slideInRight"
          // animationOut="flipOutY"
          animationOut="slideOutLeft"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={500}
          style={{}}
        >
          
          <View style={styles.modalContainer}>
            <ScrollView>

            {modalContent}

            <View style={styles.Buttons}>
              <TouchableOpacity onPress={this.props.onModalClosed} style={[styles.modalButton, {borderColor: Colors.tertiary}]}>
                  <Icon  name="ios-arrow-round-back" size={35} color={Colors.tertiary} />
              </TouchableOpacity>
              {(jobDate>=currentDate)?<TouchableOpacity onPress={this.handleOpenAlert} style={[styles.modalButton, {borderColor: Colors.primary}]}>
                  <Icon  name="ios-trash" size={30} color={Colors.primary} />
              </TouchableOpacity>:null}              
            </View>

            </ScrollView>
          </View>
          
        </Modal>

        {this.props.selectedDate !== null ?  
          <Fragment>
            <Dialog.Container contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 15}} visible={this.state.showAlert} >
              <Dialog.Title style={styles.dialogTitle}>Attenzione!</Dialog.Title>
              { this.props.selectedDate.resName!=='Impegno Personale' ? 
              <Dialog.Description style={{color: 'white'}}>
                  Vuoi davvero cancellare il tuo impegno?
                  Verrai rimosso dalla squadra di questa data, creando un disagio per il datore di lavoro! 
                  Questa App ti assegna automaticamente il punteggio di 1 stella e registra la tua disdetta.
              </Dialog.Description> :
              <Dialog.Description style={{color: 'white'}}>
                  Vuoi davvero cancellare il tuo impegno?
                  Le aziende sapranno che sei nuovamente disponibile per lavorare in questa data!
              </Dialog.Description> }

              <Dialog.Button label="Annulla" onPress={this.handleCloseAlert} />
              <Dialog.Button label="Conferma" onPress={this.handleDeleteAlert} />
            </Dialog.Container>
          </Fragment> 
          : null}

          <Dialog.Container contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 15}} visible={this.state.showSendMess} >
              <Dialog.Title style={styles.sendMessTitle}>Invia Messaggio</Dialog.Title>              
              <Dialog.Description style={{color: 'white'}}>
                  Invia un messaggio al datore di lavoro relativo a questa data:
              </Dialog.Description>

              <Dialog.Input
                style = {styles.inputMessage}
                placeholder = {'Scrivi un messaggio'}
                value = {this.state.newMessage}
                maxLength={199}
                onChangeText = {(text) => this.setState({newMessage: text})} />

              <Dialog.Button label="Annulla" onPress={this.handleCloseSendMess} />
              <Dialog.Button label="INVIA" onPress={this.handleSendMessage} />
          </Dialog.Container>

      </Fragment>
      
    );
  };
}

const styles = StyleSheet.create({
modalContainer: {
  flex:0,
  width: '85%',
  backgroundColor: Colors.grey5,    
  borderRadius: 10,
  justifyContent: 'center',  
},
dateName: {
  flexDirection: "row",
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10
},
Ribbon: {
  width: '100%',
  paddingVertical: 10,
  paddingHorizontal: 35,
  // height: '30%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20
},
avatar: {
  flex: 0,
  width: 130,
  height: 130,
  borderRadius: 75,
  borderWidth: 3,
  borderColor: "white",
  marginVertical:5,
  alignSelf:'center',
},
title: {
  color: 'white',
  // fontFamily: 'Abecedary',
  paddingHorizontal: 5,
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  // letterSpacing: 0.5,
},
subtitle: {
  paddingHorizontal: 5,
  color: 'white',
  fontSize: 12,
  fontStyle: 'italic',
  textAlign: 'center',
},
Buttons: {
  flexDirection: "row",
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  marginHorizontal: 40
},
showOffer: {
  width: '100%',
  paddingHorizontal: 35,
  backgroundColor: Colors.grey4,    
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20    
},
notes: {    
  color: Colors.grey1,
  fontSize: 14,        
  textAlign: 'center',
},
modalButton: {
  alignItems: 'center',
  justifyContent: 'center',
  width:45,
  height:45,
  backgroundColor:'transparent',
  borderRadius:75,
  borderWidth:3,
  marginTop: 5
},
sendButton: {
  marginTop: 15,
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
  height:30,  
  borderRadius:75,
},
btnActive: {
backgroundColor: Colors.tertiary 
},
btnInActive: {
  backgroundColor: Colors.grey4 
  },
dialogTitle:{
  color:Colors.primary, 
  fontSize: 25, 
  // fontFamily: 'Abecedary', 
  fontWeight:'bold'
  },
  sendMessTitle:{
    color:Colors.tertiary, 
    fontSize: 20,    
    fontWeight:'bold'
  },
  inputMessage: {
		alignItems: 'center',		
    justifyContent: 'center',
    backgroundColor: 'white'
	},
});