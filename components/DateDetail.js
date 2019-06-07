import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Dialog from "react-native-dialog";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import * as Colors from '../components/themes/colors';

// Trasformato DateDetail.1 da funzione a classe Componente
// Quando si costruisce un componente avente delle proprietà, 
// bisogna richiamare super(props) nel costruttore prima di ogni altra operazione!
// nel metodo render() le props si richiamano con this.props.

const months = ['Gennaio','Febbraio','Marzo','Aprile', 'Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const weekday = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];

export default class DateDetail extends Component {

  constructor(props){
    super(props)
    this.state={
      showAlert: false
    }
  }

  getWeekDay = (date) => (weekday[parseInt(moment(date).format('d'))]);
  getMonth = (date) => (months[parseInt(date.split('-')[1])-1]);

  
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

    let modalContent = null;
    
    
    if (this.props.selectedDate) {
      modalContent = (
        <View>
          <View style={styles.dateName}>
              <Text style={styles.dateStyle}>{this.getWeekDay(this.props.selectedDate.comDate)+' '}</Text>
              <Text style={styles.dateStyle}>{this.props.selectedDate.comDate.split('-')[2]+' '}</Text>
              <Text style={styles.dateStyle}>{this.getMonth(this.props.selectedDate.comDate)}</Text>              
          </View>
          <View style={{justifyContent: 'flex-end' }}>
              <Text style={styles.commitStyle}>{this.props.selectedDate.resName}</Text>
              { this.props.selectedDate.resName!=='Impegno Personale' ? 
                (<Text style={styles.TextStyle}> Indirizzo: {this.props.selectedDate.resAddress} </Text>) : null
              }
              <View style={{ width: '100%', height: 2, backgroundColor: Colors.grey4, margin: 5 }} />
              <Text style={styles.TextStyle}> Orario Appuntamento: {this.props.selectedDate.comTime.slice(0, -3)} </Text>
              <Text style={styles.TextStyle}> Compenso: {this.props.selectedDate.comPay} </Text>
              <Text style={styles.TextStyle}> Note: {this.props.selectedDate.comNote} </Text>
              <View style={{ width: '100%', height: 2, backgroundColor: Colors.grey4, margin: 5 }} />
          </View>
        </View>
      );
    }


    return (

      <Fragment>
        

        <Modal
          onRequestClose={this.props.onModalClosed}
          supportedOrientations={['portrait', 'landscape']}
          isVisible={this.props.selectedDate !== null}
          // animationIn="slideInLeft"
          // animationOut="slideOutRight"
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          <View style={styles.modalContainer}>

            {modalContent}

            <View style={styles.Buttons}>
              <TouchableOpacity onPress={this.props.onModalClosed} style={[styles.modalButton, {backgroundColor: Colors.primary}]}>
                  <Icon  name="ios-close" size={35} color='white' />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleOpenAlert} style={[styles.modalButton, {backgroundColor: Colors.secondary}]}>
                  <Icon  name="ios-trash" size={35} color='white' />
              </TouchableOpacity>
              
            </View>

          </View>
        </Modal>

        <Dialog.Container visible={this.state.showAlert} >
            <Dialog.Title>Attenzione!</Dialog.Title>
            <Dialog.Description>
                Vuoi davvero cancellare il tuo impegno?
                Verrai rimosso dalla squadra di lavoro di questa data!
            </Dialog.Description>
            <Dialog.Button label="Annulla" onPress={this.handleCloseAlert} />
            <Dialog.Button label="Conferma" onPress={this.handleDeleteAlert} />
        </Dialog.Container>

      </Fragment>
      
    );
  };
}

const styles = StyleSheet.create({
  modalContainer: {
    flex:0,
    // height: '70%',
    backgroundColor: Colors.grey5,    
    borderRadius: 15,
    padding: 30,
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor: Colors.grey4,
    borderWidth: 4,
    
  },
  dateName: {
    flexDirection: "row",
    height: 50,      
    backgroundColor: Colors.grey2,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  dateStyle: {
    color: 'white',
    fontWeight: "bold",    
    fontSize: 25 
  },
  commitStyle: {
    fontSize: 20, 
    color: '#000', 
    textAlign: 'center', 
    fontWeight: "bold", 
    marginBottom: 20
  },
  TextStyle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left'
  },
  Buttons: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, 
    height: 60, 
    borderRadius: 75,
    marginTop: 20
  }
});