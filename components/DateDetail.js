import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Dialog from "react-native-dialog";
import moment from "moment";

// Trasformato DateDetail.1 da funzione a classe Componente
// Quando si costruisce un componente avente delle proprietà, 
// bisogna richiamare super(props) nel costruttore prima di ogni altra operazione!
// nel metodo render() le props si richiamano con this.props.
export default class DateDetail extends Component {

  constructor(props){
    super(props)
    this.state={
      showAlert: false
    }
  }

  convertDate = (date) => {
    moment(date, 'YYYY-MM-DD', true).isValid();
    return moment(date).format("DD-MM-YYYY");
  }

  handleOpenAlert = () => {
    this.setState({ showAlert: true })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  render() {

    let modalContent = null;

    if (this.props.selectedDate) {
      modalContent = (
        <View>
          <Text style={styles.dateName}>{this.convertDate(this.props.selectedDate.comDate)}</Text>
          <Text style={styles.TextStyle}> Ore: {this.props.selectedDate.comTime.slice(0, -3)} </Text>
          <Text style={styles.TextStyle}> Ristorante: {this.props.selectedDate.resName} </Text>
          <Text style={styles.TextStyle}> Indirizzo: {this.props.selectedDate.resAddress} </Text>
          <Text style={styles.TextStyle}> Compenso: {this.props.selectedDate.comPay} </Text>
          <Text style={styles.TextStyle}> Note: {this.props.selectedDate.comNote} </Text>
        </View>
      );
    }

    return (
      <Modal
        onRequestClose={this.props.onModalClosed}
        // supportedOrientations={['portrait', 'landscape']}
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
          <View>
            <Button title="Delete" color="red" onPress={this.handleOpenAlert} />
            <Button title="Close" onPress={this.props.onModalClosed} />
            <Dialog.Container visible={this.state.showAlert}>
                <Dialog.Title>Attenzione!</Dialog.Title>
                <Dialog.Description>
                    Vuoi davvero cancellare il tuo impegno?
                </Dialog.Description>
                <Dialog.Button label="Annulla" onPress={this.handleCloseAlert} />
                <Dialog.Button label="Conferma" onPress={this.props.onItemDeleted} />
            </Dialog.Container>
          </View>
        </View>
      </Modal>
    );
  };
}

const styles = StyleSheet.create({
  modalContainer: {
    // flex:1,
    height: '70%',
    backgroundColor: 'rgba(210,210,210,0.98)',
    borderRadius: 15,
    padding: 30,
    justifyContent: 'center'
  },
  dateName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  TextStyle: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left'
  }
});