import React, { Component, Fragment } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker'
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({
  comDate: Yup
    .string()
    .required("Inserire Data"),
  comNote: Yup
    .string()
    .required("Inserire Note")
    .max(40,"Testo troppo Lungo"),
  comPay: Yup
    .number()
    .typeError('Inserire numero')
    .positive("Inserire numero positivo")
    .integer("Inserire numero intero")
  });

// How to Pass input Field Data from Modal to the Parent Container in react-Native?
// To pass data from Modal to Parent Component, you can make your Modal call a function 
// that you passed by props every time input text is changed. 
// Here's a simple callback logic you can use.
export default class AddCommit extends Component {

  constructor(props){
    super(props)
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
              <Text style={{color: 'white', fontWeight: "bold", fontSize: 20 }}>Impegno Personale</Text>
            </View>

            <Formik
              initialValues={{comNote: '', comDate: '', comTime: '', comPay: ''}}
              onSubmit={this.props.onHandleAddCommit}
              validationSchema={myvalidationSchema}
            >

            {({ values, handleChange, errors, submitCount, setFieldValue, setFieldTouched, touched, isValid, handleSubmit }) => (
              
            <Fragment>
                                  

                    <View style={styles.ElemForm}>	
                      <Text style={{marginBottom: 5, marginLeft: 15, fontSize: 16}}>Giorno:</Text> 
                      
                      <View style={{flex:1}}> 
                            <DatePicker
                                  style={{width:'100%'}}
                                  date={values.comDate}
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
                                  onDateChange={(date) => { setFieldValue("comDate", date);
                                                const convdate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
                                                this.props.onDateChanged(convdate);} 
                                  }
                            />
                      </View>
                    </View>
                    { errors.comDate && <Text style={{color: Colors.primary}}>{errors.comDate }</Text> }

                    <View style={styles.ElemForm}>	
                      <Text style={{marginBottom: 5, marginLeft: 15, fontSize: 16}}>Ora:</Text> 
                      
                      <View style={{flex:1}}> 
                            <DatePicker
                                  style={{width:'100%'}}
                                  date={values.comTime}
                                  showIcon={false}
                                  mode="time"
                                  placeholder="Inserisci Ora"
                                  androidMode='spinner'
                                  confirmBtnText="Conferma"
                                  cancelBtnText="Indietro"
                                  customStyles={{                                              
                                    dateInput: { borderWidth: 0, alignItems: 'flex-end' }                                                
                                  }}
                                  onDateChange={(time) => { setFieldValue("comTime", time);this.props.onTimeChanged(time+':00')}}
                            />
                      </View>
                    </View>
                    { errors.comTime && <Text style={{color: Colors.primary}}>{errors.comTime }</Text> }
                    
                    <View style={styles.ElemForm}>
                      <Text style={{marginBottom: 5, marginLeft: 15, fontSize: 16}}>Compenso:</Text>
                      <TextInput
                        // Importantissimo per TextInput => paddingBottom: 0 per allinearsi con altri componenti in row 
                        style={{flex:1, paddingBottom: 3, height: 30, fontSize: 16}}
                        textAlign='right'
                        // textAlignVertical='bottom'
                        placeholder="$$$"
                        keyboardType='numeric'
                        value={values.comPay}
                        onChangeText={(text) => { setFieldValue("comPay", text); this.props.onPayChanged(text) }}
                      />
                    </View>
                    { errors.comPay && <Text style={{color: Colors.primary}}>{errors.comPay }</Text> }

                    <Text style={{marginBottom: 5, marginTop: 20, marginLeft: 15, fontSize: 16}}>Note:</Text>
                    <TextInput
                        multiline = {true}
                        numberOfLines = {4}
                        value={values.comNote}
                        onChangeText={(text) => { setFieldValue("comNote", text); this.props.onInputChanged(text) }}
                        onBlur={() => setFieldTouched("comNote")}
                        style={{ marginBottom: 5, height: 60, backgroundColor: 'white'}}
                    />
                    <Text style={{color: Colors.primary}}>
                        {touched.comNote || submitCount > 0 ? errors.comNote : null }
                    </Text>
                    
                    
                    {/* 
                      Per visualizzare lo stato dei valori di Formik:
                      <Text>{JSON.stringify(values, null, 2)}</Text> 
                    */}

                    <View style={styles.Buttons}>
                        <TouchableOpacity onPress={this.props.onAddCommitClosed} style={[styles.modalButton, {backgroundColor: Colors.primary}]}>
                            <Icon  name="ios-close" size={35} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={[styles.modalButton, {backgroundColor: Colors.secondary}]}>
                            <Icon  name="ios-add" size={35} color='white' />
                        </TouchableOpacity>

                        
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
    height: 40,      
    backgroundColor: Colors.grey2,    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
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
    height: 50,
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
    marginTop: 15
  }
});