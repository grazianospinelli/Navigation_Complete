import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import moment from "moment";

const dateDetail = props => {
  let modalContent = null;
  
  convertDate = (date) => {
    moment(date, 'YYYY-MM-DD', true).isValid();
    return moment(date).format("DD-MM-YYYY");
  }

  if (props.selectedDate) {
    modalContent = (
      <View>
        <Text style={styles.dateName}>{this.convertDate(props.selectedDate.comDate)}</Text>
        <Text style={styles.TextStyle}> Ore: {props.selectedDate.comTime.slice(0, -3)} </Text>
        <Text style={styles.TextStyle}> Ristorante: {props.selectedDate.resName} </Text>
        <Text style={styles.TextStyle}> Indirizzo: {props.selectedDate.resAddress} </Text>
        <Text style={styles.TextStyle}> Compenso: {props.selectedDate.comPay} </Text>
        <Text style={styles.TextStyle}> Note: {props.selectedDate.comNote} </Text>
      </View>
    );
  }
  return (
    <Modal
      onRequestClose={props.onModalClosed}
      visible={props.selectedDate !== null}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        {modalContent}
        <View>
          <Button title="Delete" color="red" onPress={props.onItemDeleted} />
          <Button title="Close" onPress={props.onModalClosed} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 22
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

export default dateDetail;
