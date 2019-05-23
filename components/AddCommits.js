import React, { Component, Fragment } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker'
import moment from "moment";
import { TextField } from "react-native-material-textfield";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({
  comDate: Yup
    .string()
    .required("Inserire Data!"),
  comTime: Yup
    .string()
    .required("Inserire Ora"),
  comNote: Yup
    .string()
    .max(40,"Troppo Lungo"),
  });

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
          // visible = {this.props.openAddCommit}
          isVisible={this.props.openAddCommit}
          animationType="slide"
          onRequestClose={() => {}}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000} 
      >
        <View style={styles.modalContainer}>

            <View style={styles.Title}>
              <Text style={{color: 'white', fontWeight: "bold", fontSize: 25 }}>Impegno Personale</Text>
            </View>

            <Formik
              onSubmit={values => alert(JSON.stringify(values))}
              // onSubmit={values => this.update(values)}
              validationSchema={myvalidationSchema}
            >

            {({ values, handleChange, errors, submitCount, setFieldValue, setFieldTouched, touched, isValid, handleSubmit }) => (
            <Fragment>

                    <TextField
                        label="Note"
                        value={values.comNote}
                        onChangeText={text => setFieldValue("comNote", text)}
                        // onChangeText={(changedText) => this.props.onInputChanged(changedText)} 
                        onBlur={() => setFieldTouched("comNote")}
                        error={touched.comNote || submitCount > 0 ? errors.comNote : null}
                        style={{borderRadius: 25, width:220, height: 60, backgroundColor: 'gray'}}
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
                                  onDateChange={(date) => setFieldValue("comDate", date)}
                                  // onDateChange={(date) => {
                                  //     const convdate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
                                  //     this.props.onDateChanged(convdate); 
                                  //     this.setState({comDate: date})}
                                  // }
                            />
                      </View>
                    </View>

                    <View style={styles.Buttons}>
                        <TouchableOpacity onPress={this.props.onAddCommitClosed} style={[styles.modalButton, {backgroundColor: Colors.primary}]}>
                            <Icon  name="ios-close" size={35} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{}} style={[styles.modalButton, {backgroundColor: Colors.secondary}]}>
                            <Icon  name="ios-add" size={35} color='white' />
                        </TouchableOpacity>

                        {/* <Button title="Add" color="red" onPress={this.props.onHandleAddCommit} />
                        <Button title="Close" onPress={this.props.onAddCommitClosed} /> */}
                    </View>
            
              </Fragment>
              )}
            </Formik> 
          
        </View>
      </Modal>
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
  Title: {
    height: 50,      
    backgroundColor: Colors.grey2,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
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