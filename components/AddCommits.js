import React, { Component } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker'
import moment from "moment";

// How to Pass input Field Data from Modal to the Container in react-Native?
// To pass data from Modal to Parent Component, you can make your Modal call a function 
// that you passed by props every time input text is changed. 
// Here's a simple callback logic you can use.

export default class AddCommit extends Component {

  constructor(props){
    super(props)
    this.state = {
      comDate: null
    }
  }

  
  render() {
    return (
      <Modal
          visible = {this.props.openAddCommit}
          animationType="slide"
          onRequestClose={() => {}} 
      >
        <View style={styles.modalContainer}>
          <View>

            <TextInput
             placeholder="Inserisci Note"
						 style={{borderRadius: 25, width:220}}	
						 underlineColorAndroid="transparent"              
             onChangeText={(changedText) => this.props.onInputChanged(changedText)} 
            />

            <View style={styles.ElemForm}>	
              <Text style={{marginBottom: 10, marginLeft: 15, fontSize: 16}}>Giorno:</Text> 
              
              <View style={{flex:1}}> 
                    <DatePicker
                          style={{width:'100%'}}
                          date={this.state.comDate}
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
                          onDateChange={(date) => {
                              const convdate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
                              this.props.onDateChanged(convdate); 
                              this.setState({comDate: date})}
                          }
                    />
              </View>
            </View>

            <Button title="Add" color="red" onPress={this.props.onHandleAddCommit} />
            <Button title="Close" onPress={this.props.onAddCommitClosed} />
            
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
  },
  ElemForm: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end', 
    height: 70,
    borderBottomWidth: .2,
    borderColor: 'gray',
  },
});