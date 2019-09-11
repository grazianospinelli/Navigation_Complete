import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Dialog from "react-native-dialog";
import {getWeekDay, getYear, getMonth} from './DateUtility';
import Icon from "react-native-vector-icons/Ionicons";
import * as Colors from './themes/colors';

// Trasformato DateDetail da funzione a classe Componente
// Quando si costruisce un componente avente delle proprietà, 
// bisogna richiamare super(props) nel costruttore prima di ogni altra operazione!
// nel metodo render() le props si richiamano con this.props.

const Separator = (colorSep) => (
    <View style={{width: '70%', height: 2, backgroundColor: colorSep, marginVertical: 20 }} />
);

export default class DateDetail extends Component {

  constructor(props){
    super(props)
    this.state={
      showAlert: false
    }
    modalContent = null;
  }
  
  handleOpenAlert = () => {
    this.setState({ showAlert: true })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  handleDeleteAlert = () => {
      // this.props.onItemDeleted non veniva richiamato dentro questa funzione
      // solo aggiungendo () in coda alla funzione viene richiamato.
      // senza parentesi viene passata direttamente la funzione come prop da impegni a DateDetail
      // ma se viene messa in un altra funzione come in questo caso non va.
      // con le parentesi invece si effettua una chiamata alla funzione nel componente padre
      // ma probabilemente c'è un calo di prestazioni.
      this.props.onItemDeleted();
      this.setState({showAlert: false});    
  }

  
  render() {
    if (this.props.selectedDate) {
      const {selectedDate: { comID, comDate, comTime, comPay, comMansion, comNote, resName, resAddress, resCity, resProv, resTel }} = this.props;
      
      switch((comID % 4)) {
        case(0):
        var caseStyle=Colors.primary;
        break;
        case(1):
        var caseStyle='#00d6d6';
        break;
        case(2):
        var caseStyle=Colors.tertiary;
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
                <Text style={styles.subtitle} numberOfLines={2}> {resAddress} </Text>
                <Text style={styles.subtitle}> {resCity+' - ('}
                {resProv?resProv:'--'}{')'} </Text>                       
                <Text style={styles.subtitle}>{'Tel: '+resTel}</Text>
                </Fragment>) : null
              }
          </View>

          <View style={styles.showOffer}>
                        <Text style={[styles.notes, {fontSize: 15, fontWeight: 'bold', marginBottom: 5}]}>{comMansion.toUpperCase()}</Text> 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>ORE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{comTime.substr(0,5)}</Text>                            
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>PAGA: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{comPay}{' €'}</Text>
                        </View>
                        <View style={{flexDirection: 'row', width: '65%'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>NOTE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic'}]} numberOfLines={3} ellipsizeMode='tail'>{comNote?comNote:'  - - -'}</Text>
                        </View>
          </View>

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
          animationIn="flipInY"
          animationOut="flipOutY"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          <View style={styles.modalContainer}>

            {modalContent}

            <View style={styles.Buttons}>
              <TouchableOpacity onPress={this.props.onModalClosed} style={[styles.modalButton, {borderColor: Colors.tertiary}]}>
                  <Icon  name="ios-arrow-round-back" size={40} color={Colors.tertiary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleOpenAlert} style={[styles.modalButton, {borderColor: Colors.primary}]}>
                  <Icon  name="ios-trash" size={35} color={Colors.primary} />
              </TouchableOpacity>              
            </View>

          </View>
        </Modal>

        {this.props.selectedDate !== null ?  
          <Fragment>
            <Dialog.Container contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 15}} visible={this.state.showAlert} >
              <Dialog.Title style={styles.dialogTitle}>Attenzione!</Dialog.Title>
              { this.props.selectedDate.resName!=='Impegno Personale' ? 
              <Dialog.Description style={{color: 'white'}}>
                  Vuoi davvero cancellare il tuo impegno?
                  Verrai rimosso dalla squadra di lavoro di questa data,
                  creando un disagio per la sala!
              </Dialog.Description> :
              <Dialog.Description style={{color: 'white'}}>
                  Vuoi davvero cancellare il tuo impegno?
                  Le aziende sapranno che sei disponibile per lavorare in questa data!
              </Dialog.Description> }

              <Dialog.Button label="Annulla" onPress={this.handleCloseAlert} />
              <Dialog.Button label="Conferma" onPress={this.handleDeleteAlert} />
            </Dialog.Container>
          </Fragment> 
          : null}

        

      </Fragment>
      
    );
  };
}

const styles = StyleSheet.create({
modalContainer: {
  flex:0,
  backgroundColor: Colors.grey5,    
  borderRadius: 10,
  justifyContent: 'center',
},
dateName: {
  flexDirection: "row",
  alignItems: 'center',
  justifyContent: 'center',
  margin: 20
},
Ribbon: {
  width: '100%',
  paddingVertical: 10,
  // height: '30%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20
},
title: {
  color: 'white',
  fontFamily: 'Abecedary',
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
  marginHorizontal: 50
},
showOffer: {
  backgroundColor: Colors.grey4,    
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20    
},
notes: {    
  color: Colors.grey1,
  fontSize: 15,        
  textAlign: 'center',
},
modalButton: {
  alignItems: 'center',
  justifyContent: 'center',
  width:55,
  height:55,
  backgroundColor:'transparent',
  borderRadius:75,
  borderWidth:3,
  marginTop: 20
},
dialogTitle:{
  color:Colors.primary, 
  fontSize: 25, 
  fontFamily: 'Abecedary', 
  fontWeight:'bold'
  }  
});