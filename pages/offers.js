import React, { Component, Fragment } from 'react';
import {  View, ActivityIndicator, Text, Image, AsyncStorage, Dimensions,
          ImageBackground, ScrollView, TouchableOpacity, StyleSheet  } from 'react-native';
import {NavigationEvents} from "react-navigation";
import Carousel from 'react-native-snap-carousel';
import Dialog from "react-native-dialog";
import ClipPage from '../components/ClipPage';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
// import FireManager from '../components/firemanager.js';
import firebase from 'react-native-firebase';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

const { width, height } = Dimensions.get('window');

export default class OfferScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
      ActiveSlide: null,
      AcceptAlert: false,
      RejectAlert: false,
      viewportWidth: width,
      viewportHeight: height,
    };

    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      this.setState({viewportWidth: width, viewportHeight: height});
    })

  }
  
  static navigationOptions = {
    drawerLabel: "Offerte di Lavoro",
    drawerIcon: () =>(
    <Icon  name="briefcase" size={20} color={Colors.secondary} />),
  }

  fetchData = () => {
    AsyncStorage.getItem(USER_UUID)
    .then((userUuid) => {
        this.setState({uuid: userUuid});
        fetch(`${IP}/loadjoboffers.php`,{
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
          this.setState({dataSource: responseJson});
          if (this.state.ActiveSlide === null) {this.setState({ActiveSlide: this.state.dataSource.length - 1});}          
          this.setState({loading: false});
          // console.log('State: ' +JSON.stringify(this.state));
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    })
    .catch(error=>console.log(error))
  }
  
  componentDidMount() {

    const unitId = 'ca-app-pub-3940256099942544/4411468910';
    // const unitId = 'ca-app-pub-4641414830745834/5890822051';
    const advert = firebase.admob().interstitial(unitId);
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    advert.loadAd(request.build());

    advert.on('onAdLoaded', () => {
      console.log('Advert ready to show.');
      advert.show();
    });

    this.fetchData();
    FireManager();
  }

  reload = () => {
    this.setState({loading: true});
    this.fetchData();
    this.setState({ActiveSlide: this.state.dataSource.length - 1});
  }
  
  
  removeCard = () => {
    fetch(`${IP}/deloffers.php`,{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        id: this.state.dataSource[this.state.ActiveSlide].joID,
        uuid: this.state.uuid
      })
    })
    .then((response) => response.json())
    .then((responseJson)=> {
      if (responseJson == 'OK') {
        if (this.state.ActiveSlide == 0) {
          this._carousel.snapToNext();
        }
        else {
          this._carousel.snapToPrev();
          this.setState((prevState) => ({ActiveSlide: prevState.ActiveSlide - 1}));
        }
        this.fetchData();
      }
      else {alert('Errore aggiornamento offerte di lavoro')}
    })
    .catch(error=>console.log(error))
  };

  acceptJob = () => {
    console.log('ID:'+this.state.dataSource[this.state.ActiveSlide].joID);
    console.log('Date:'+this.state.dataSource[this.state.ActiveSlide].joDate);

    fetch(`${IP}/acceptjob.php`,{
      method:'post',
      header:{
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify({
        id: this.state.dataSource[this.state.ActiveSlide].joID,
        uuid: this.state.uuid,
        date: this.state.dataSource[this.state.ActiveSlide].joDate,
      })
    })
    .then((response) => response.json())
    .then((responseJson)=> {
      if (responseJson == 'OK') {
        if (this.state.ActiveSlide == 0) {
          this._carousel.snapToNext();
        }
        else {
          this._carousel.snapToPrev();
          this.setState((prevState) => ({ActiveSlide: prevState.ActiveSlide - 1}));
        }
        this.fetchData();
      }
      else {alert('Errore aggiornamento offerte di lavoro')}
    })
    .catch(error=>console.log(error))
  };
  
  OpenAcceptAlert = () => {
    this.setState({ AcceptAlert: true })
  }

  CloseAcceptAlert = () => {
    this.setState({ AcceptAlert: false })
  }

  OpenRejectAlert = () => {
    this.setState({ RejectAlert: true })
  }

  CloseRejectAlert = () => {
    this.setState({ RejectAlert: false })
  }

  handleAccept = () => {
    this.acceptJob();
    this.setState({ AcceptAlert: false })
  }

  handleReject = () => {
    this.removeCard();
    this.setState({ RejectAlert: false })
  }

  _renderItem = ({item, index}) => {
    // console.log(index+' --- '+this.state.dataSource[index].joID);
    return <ClipPage data={item} even={(this.state.dataSource[index].joID) % 4 } />;    
  }



  render() {

    var backPage=null;
    if (this.state.dataSource == 'EMPTY') {
        offerComponent = (
          <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
            <View style={styles.emptyJob}>
              <Image style={{width: 120, height: 120, margin: 30}} source={require('../components/images/staffextralogo.png')} resizeMode='cover' />  
              <Text style={{fontFamily: 'Abecedary', fontSize: 30}}> Nessun Offerta </Text>
            </View>
          </View>         
        );
        buttonStripe =(
          <View style={styles.footer}>
            <View style={{ width: '80%', alignItems: 'center', marginBottom: 7}}>              
              <View style={{alignItems: 'center'}}>
                <Text style={{color: Colors.secondary, fontSize: 10, fontWeight:'bold'}}>Ricarica</Text>
                <TouchableOpacity style={[styles.button,styles.orange]} onPress={this.reload}>
                  <Icon style={{ padding: 5 }} name="reload" size={25} color={Colors.secondary} />                    
                </TouchableOpacity>
              </View>             
            </View>
          </View>
        )
    } 
    else {
      offerComponent = (
        <Fragment>
          <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.dataSource}
              firstItem={this.state.ActiveSlide}
              renderItem={this._renderItem}
              
              sliderWidth={this.state.viewportWidth}
              itemWidth={this.state.viewportWidth}
              contentContainerCustomStyle={{paddingVertical: 10}}
              containerCustomStyle={{transform: [{ scaleX: 1 }]}}
              
              layoutCardOffset={15}
              useScrollView={true}
              layout={'tinder'}
              loop={false}
              onSnapToItem={(index) => this.setState({ ActiveSlide: index }) }
          />         
        </Fragment>
      );
      buttonStripe =(
        <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color:Colors.primary, fontSize: 10, fontWeight:'bold'}}>Rifiuta</Text>
                <TouchableOpacity style={[styles.button,styles.red]} onPress={this.OpenRejectAlert}>
                    <Icon style={{ padding: 5 }} name="dislike" size={25} color={Colors.primary} />                    
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: Colors.secondary, fontSize: 10, fontWeight:'bold'}}>Ricarica</Text>
                <TouchableOpacity style={[styles.button,styles.orange]} onPress={this.reload}>
                  <Icon style={{ padding: 5 }} name="reload" size={25} color={Colors.secondary} />                    
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{color:Colors.tertiary, fontSize: 10, fontWeight:'bold'}}>Accetta</Text>
                <TouchableOpacity style={[styles.button,styles.green]} onPress={this.OpenAcceptAlert}>
                    <Icon style={{ padding: 5 }} name="like" size={25} color={Colors.tertiary} />  
                </TouchableOpacity>
              </View>
              
            </View>
        </View>
      );
      backPage=(
        <TouchableOpacity 
            style={{position:'absolute',right:0,top:0,margin: 5}} 
            onPress={() => {this._carousel.snapToNext();}}>
              <Icon style={{ padding: 5 }} name="arrow-left-circle" size={25} color={Colors.secondary} />  
        </TouchableOpacity>
      );

    }


    if(this.state.loading){
      return(
        <View style={{flex: 1}}>
          <ImageBackground source={require('../components/images/clipdesk.jpg')} style={styles.backgroundImage} >
            <View style={styles.loader}> 
              <ActivityIndicator size="large" color="#0c9"/>
            </View>
          </ImageBackground> 
        </View>
       )
    }

    // console.log(this.state.dataSource);
    // console.log('stateIndex: '+this.state.ActiveSlide);
    // console.log('job ID: '+this.state.dataSource[this.state.ActiveSlide].joID);
    
    return(
     
      <View style={{flex: 1}}>
              
          <ImageBackground source={require('../components/images/clipdesk.jpg')} style={styles.backgroundImage} >

            <View style={{flex: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                <Text style={styles.title}>{'Offerte di Lavoro'}</Text>
                {backPage}
            </View>

            <View style={styles.clipboard}>
                {offerComponent}
            </View>

            {buttonStripe}

          </ImageBackground>

          <Dialog.Container contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 15}} visible={this.state.AcceptAlert} >
            <Dialog.Title style={styles.dialogTitle}>Attenzione!</Dialog.Title>
            <Dialog.Description style={{color: 'white'}}>
                Accettando l'offerta prendi un impegno di lavoro
                vincolante con la sala ricevimenti.
            </Dialog.Description>
            <Dialog.Button label="Annulla" onPress={this.CloseAcceptAlert} />
            <Dialog.Button label="Conferma" onPress={this.handleAccept} />
          </Dialog.Container>

          <Dialog.Container contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 15}} visible={this.state.RejectAlert} >
            <Dialog.Title style={styles.dialogTitle}>Attenzione!</Dialog.Title>
            <Dialog.Description style={{color: 'white'}}>
                Vuoi davvero rifiutare questa Offerta?
                Se rifiuti l'offerta non comparirà più nella lista.                
            </Dialog.Description>
            <Dialog.Button label="Annulla" onPress={this.CloseRejectAlert} />
            <Dialog.Button label="Conferma" onPress={this.handleReject} />
          </Dialog.Container>
        
        <NavigationEvents onDidFocus={()=>this.fetchData()} />

      </View>
      
      );
    
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    // height: '100%',
		// justifyContent: 'center',
    resizeMode: 'cover',
    // resizeMode: 'contain', 
	},
  clipboard: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: '9.36%',
    // alignItems: 'center',
  },
  title: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    color: Colors.grey5,
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 10,
    textAlign: 'center',
  },
  TextStyle: {
    fontSize: 25,
    textAlign: 'center',
  },
  emptyJob:
  {
    width: '82%',
    height: '76%',
    marginTop: '18%',    
    backgroundColor: '#e9e9e9',
    borderColor: '#b5b5b5',
    borderBottomWidth: 2,
    borderTopWidth: 1,
    // borderStyle: 'dashed',
    // borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  footer:{
    justifyContent:'flex-end',
    alignItems:'center'
  },
  buttonContainer:{
    width: '70%',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom: 7
  },
  button:{
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity:1,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 5,
  },
  orange:{
    width:55,
    height:55,
    backgroundColor:'transparent',
    borderWidth:3,
    borderColor: Colors.secondary,    
    borderRadius:55,
    // marginTop:-15
  },
  green:{
    width:55,
    height:55,
    backgroundColor:'transparent',
    borderRadius:75,
    borderWidth:3,
    borderColor: Colors.tertiary,
  },
  red:{
    width:55,
    height:55,
    backgroundColor:'transparent',
    borderRadius:75,
    borderWidth:3,
    borderColor:Colors.primary,
  },
  loader:{
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
   },
   dialogTitle:{
    color:Colors.primary, 
    fontSize: 25, 
    fontFamily: 'Abecedary', 
    fontWeight:'bold'
   }  
});
