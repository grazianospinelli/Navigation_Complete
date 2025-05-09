import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from "react-navigation";
import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';
import ActionButton from 'react-native-action-button';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import DateList from "../components/DateList";
import DateDetail from "../components/DateDetail";
import AddCommit from "../components/AddCommits";
import * as Colors from '../components/themes/colors';
// import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';


export default class JobScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
      selectedDate: null,
      openAddCommit: false,
      noteAddCommit: '',
      dateAddCommit: null,
      timeAddCommit: '00:00:00',
      payAddCommit: null
    };
  }

  static navigationOptions = {
        drawerLabel: "Lista Impegni",
        drawerIcon: () =>(
        <Icon  name="notebook" size={20} color={Colors.secondary} />),
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
          if (responseJson != 'EMPTY') {
            // console.log(responseJson);
            this.setState({dataSource: responseJson.reverse()});
          } else {
            this.setState({dataSource: responseJson});  
          }
          this.setState({loading: false});
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    })
    .catch(error=>console.log(error))
  }
  
  componentDidMount() {
    // Quando arriva una notifica firebase ricarica i dati degli Impegni
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {      
      if ((notification.body!==undefined)) {
        this.fetchData();         
      }      
    });
    
    this.fetchData();

  }
 
  dateDeletedHandler = () => {
        this.setState({selectedDate: null});
        this.fetchData();       
  };

  modalClosedHandler = () => {
    this.setState({selectedDate: null});
  };

  dateSelectedHandler = key => {
    this.setState(prevState => {
      return {
        // Stiamo impostando il valore di selectedDate
        // Confrontando il valore comID di tutti gli oggetti 
        // dell'array di oggetti date con il valore di key
        selectedDate: prevState.dataSource.find(date => {
          return date.comID === key;
        })
      };
    });
  };

  onInputChanged = (changedText) => {
    this.setState({noteAddCommit: changedText});    
  }

  onDateChanged = (changedDate) => {
    this.setState({dateAddCommit: changedDate});    
  }

  onPayChanged = (changedPay) => {
    this.setState({payAddCommit: changedPay});    
  }

  onTimeChanged = (changedTime) => {
    this.setState({timeAddCommit: changedTime});    
  }

  addCommitClosedHandler = () => {
    this.setState({openAddCommit: false});
  };

  addCommitHandler = () => {
    
        this.setState({loading: true});
        // console.log(this.state);
        
        fetch(`${IP}/uploadcommitments.php`,{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            uuid: this.state.uuid,
            date: this.state.dateAddCommit,
            time: this.state.timeAddCommit,
            pay: parseInt(this.state.payAddCommit),
            note: this.state.noteAddCommit
          })
        })
        .then((response) => response.json())
        .then((responseJson)=> {
          if (responseJson == 'OK') {
            alert('Aggiunto nuovo impegno');
            this.fetchData();
            // la data non puo essere vuota perche non renderizza la lista
          }
          // aggiungere else per data già esistente
          else {
            
            if (responseJson == 'KO') { alert('Errore aggiornamento lista impegni'); }
            else { alert('Data già presente')}

            this.setState({loading: false});
          }
        })
        .catch(error=>console.log(error));

    this.setState({openAddCommit: false});

    // Reset per nuove immissioni.
    // Gli altri campi non vengono resettati perchè hanno immissione obbligatoria
    this.setState({timeAddCommit: '00:00:00'});
    this.setState({payAddCommit: null});

  };


  render() {

    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }
                 
    return(
      <View style={styles.container}>
        {/* Definizione dei 2 modali usati nella pagina: */}
        <DateDetail
            selectedDate={this.state.selectedDate}
            onItemDeleted={this.dateDeletedHandler}
            onModalClosed={this.modalClosedHandler}
        />
        <AddCommit
            openAddCommit={this.state.openAddCommit}
            onInputChanged={this.onInputChanged}
            onDateChanged={this.onDateChanged}
            onTimeChanged={this.onTimeChanged}
            onPayChanged={this.onPayChanged}
            onHandleAddCommit={this.addCommitHandler}            
            onAddCommitClosed={this.addCommitClosedHandler}
        />

        <Text style={styles.pageName}>Lista Impegni</Text>
        <NavigationEvents onDidFocus={()=>this.fetchData()} />
        
        <ScrollView style={{width: '100%'}} >
        
          <DateList
            dates={this.state.dataSource}
            onItemSelected={this.dateSelectedHandler}
          />
       
        </ScrollView>
       
          <ActionButton buttonColor={Colors.primary}>
                <ActionButton.Item 
                      buttonColor={Colors.secondary} 
                      title="Aggiungi Impegno Personale" 
                      onPress={() => {this.setState({openAddCommit: true});}}                  
                >
                    <Icon name="pencil" style={styles.actionButtonIcon} />
                </ActionButton.Item>

                {/* <ActionButton.Item 
                      buttonColor={Colors.tertiary} 
                      title="Aggiorna" 
                      onPress={() => this.fetchData()}                  
                >
                    <Icon name="reload" style={styles.actionButtonIcon} />
                </ActionButton.Item> */}
                
                
                
          </ActionButton>
        
          {/* <NavigationEvents onDidFocus={()=>this.fetchData()} /> */}
               
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#e9e9e9',
    // justifyContent: 'center',
  },

  pageName: {
    margin: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },  
  
});


// AppRegistry.registerComponent('profile', () => profile);
