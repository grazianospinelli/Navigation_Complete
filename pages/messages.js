import React, { Component, Fragment } from 'react';
import { View, Text, ActivityIndicator, AsyncStorage, ScrollView, StyleSheet } from 'react-native';
import {NavigationEvents} from "react-navigation";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import firebase from 'react-native-firebase';
import Accordion from '../components/Accordion';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

export default class MessageScreen extends Component {

  constructor(props) {
      super(props);
      
      this.state = {
        uuid: '',
        loading: true,
        dataSource:[],        
        light: 'white',
        dayDetail: null,
        dayNote: null,        
      };      
  }

  // static navigationOptions = {
  //       drawerLabel: "Messaggi",
  //       drawerIcon: () =>(
  //       <Icon  name="bubble" size={20} color={Colors.secondary} />
  //     )
  // }
  

  composeData = (array) => {
    // Trasforma questo vettore di oggetti
    // [
    //   {mesID: 1, mesFromUUID: "8d3ab10f-5bc3-41a6-b81b-68b83b8cec54", mesDate: "2020-12-25", mesNotChecked: 1, resName: "Villa Fano del Poggio Ricevimenti"},
    //   {mesID: 2, mesFromUUID: "8d3ab10f-5bc3-41a6-b81b-68b83b8cec54", mesDate: "2020-12-25", mesNotChecked: 1, resName: "Villa Fano del Poggio Ricevimenti"},      
    //   {mesID: 4, mesFromUUID: "8d3ab10f-5bc3-41a6-b81b-68b83b8cec54", mesDate: "2020-12-10", mesNotChecked: 1, resName: "Villa Fano del Poggio Ricevimenti"},
    //   {mesID: 3, mesFromUUID: "9ba58648-5b2a-43c5-8d1b-740fb730fca7", mesDate: "2020-11-02", mesNotChecked: 1, resName: "Rotondo Catering"},
    //   {mesID: 3, mesFromUUID: "9ba58648-5b2a-43c5-8d1b-740fb730fca7", mesDate: "2020-11-02", mesNotChecked: 1, resName: "Rotondo Catering"}
    // ]
    // in questa struttura dati da passare all'accordion
    // [
    //   {
    //     data: [
    //       {key: "2020-12-25", unc: 2}, 
    //       {key: "2020-12-10", unc: 1}
    //     ],
    //     title: "Villa Fano del Poggio Ricevimenti",
    //     uncheck: 3,
    //     uuid: "8d3ab10f-5bc3-41a6-b81b-68b83b8cec54"
    //   }, 
    //   {
    //     data: [
    //       {key: "2020-11-02", unc: 2}, 
    //     ],
    //     title: "Rotondo Catering",
    //     uncheck: 2,
    //     uuid: "9ba58648-5b2a-43c5-8d1b-740fb730fca7"
    //   }
    // ]
    // uncheck è la somma di unc e indica quanti messaggi non letti ci sono per ogni data per quella sala


    var output = [];
    if(array){      
      var j=0
      var tot = 0
      var tot2 = 0
      var arr_data= []

      for (i=0; i<array.length;i++){
          var obj = {}    
          if (i==0){    	
            obj["uuid"]=array[i].mesFromUUID
            obj["title"]=array[i].resName
            obj["photo"]=array[i].resPhoto
            arr_data.push(Object.assign({key: array[i].mesDate, unc: array[i].mesNotChecked}))
            obj["data"]=arr_data
            tot=tot+array[i].mesNotChecked
            tot2=tot
            obj["uncheck"]=tot
            output[j]=obj
          }
          else {
            if (array[i].mesFromUUID===array[i-1].mesFromUUID) {
              tot=tot+array[i].mesNotChecked
              output[j].uncheck=tot
              if (array[i].mesDate===array[i-1].mesDate) {
                tot2=tot2+array[i].mesNotChecked          
                output[j].data.find(elem=>{return elem.key===array[i].mesDate}).unc=tot2
              }
              else{
                tot2=array[i].mesNotChecked
                output[j].data.push(Object.assign({key: array[i].mesDate, unc: tot2}))
              }
            }
            else{
              j=j+1
              tot=0
              tot2=array[i].mesNotChecked
              var arr_data= []
              obj["uuid"]=array[i].mesFromUUID
              obj["title"]=array[i].resName
              obj["photo"]=array[i].resPhoto
              arr_data.push(Object.assign({key: array[i].mesDate, unc: array[i].mesNotChecked}))
              obj["data"]=arr_data
              tot=tot+array[i].mesNotChecked
              obj["uncheck"]=tot
              output[j]=obj
            }
          }    
      }
    }
    // console.log(output)      
    return output
  }
    
  fetchData = () => {

    AsyncStorage.getItem(USER_UUID)
    .then((userUuid) => {
        this.setState({uuid: userUuid});
        this.setState({loading: true});
        fetch(`${IP}/getMessagesChan.php`,{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            // we will pass our input data to server
            touuid: userUuid
          })
        })
        .then((response) => response.json())
        .then((responseJson)=> {
          console.log(responseJson);
          this.setState({dataSource: this.composeData(responseJson)});
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
  
  renderAccordions=()=> {
    const items = [];
    for (item of this.state.dataSource) {
        items.push(
            <Accordion
              navigation={this.props.navigation}
              key = {item.uuid}
              uuid = {item.uuid} 
              title = {item.title}
              photo = {item.photo}
              data = {item.data}
              unchecked = {item.uncheck}
            />
        );
    }
    return items;
  } 
  
  render() {

    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    // const unitId = 'ca-app-pub-4641414830745834/6174410009';
    const unitId = 'ca-app-pub-3940256099942544/2934735716';

    // const unitId =
    //   Platform.OS === 'ios'
    //     ? 'ca-app-pub-7987914246691031/4248107679'
    //     : 'ca-app-pub-7987914246691031/5729668166';

    

        
    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }    
   
    return (
      <Fragment>

        <Text style={styles.pageName}>Messaggi Ricevuti</Text>
        
        <ScrollView style={{width: '100%'}} >
            { this.renderAccordions() }
            <View style={styles.bottomContainer} />
        </ScrollView>
                  
        {/* Per riaggiornare automaticamente la pagina quando la si seleziona da drawer */}
        <NavigationEvents onDidFocus={()=>this.fetchData()} />

        <Banner
          style={{position:'absolute', bottom:0}}
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => {console.log('Advert loaded');}}
          onAdFailedToLoad={(error) => {
            console.log('Advert fail');
            console.log(error.code);
            console.log(error.message);
          }}
        />

    </Fragment>
    );

  }
}


const styles = StyleSheet.create({
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
   bottomContainer: {
    height: 100,
    flex:1
   },
   pageName: {
    margin: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});