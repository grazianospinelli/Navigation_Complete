import React, { Component, Fragment } from 'react';
import { ImageBackground, View, ActivityIndicator, Text, Image, AsyncStorage, TouchableOpacity, StyleSheet } from 'react-native';
import {NavigationEvents} from "react-navigation";
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import FireManager from '../components/firemanager.js';
import { USER_UUID } from '../components/auth';
import IP from '../config/IP';

export default class OfferScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      dataSource:[],
      swipedAllCards: false,
      swipeDirection: '',
      ActiveSlide: 0,      
    };
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
          // if (this.state.ActiveSlide === null) {this.setState({ActiveSlide: this.state.dataSource.length - 1});}          
          this.setState({loading: false});          
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    })
    .catch(error=>console.log(error))
  }
  
  componentDidMount() {
    this.fetchData();
    FireManager();
  }

  reload = () => {
    this.fetchData();
    this.setState({ActiveSlide: 0});
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
  
  _renderItem = (item, index) => {
    return (
      <View style={{
        width: '84%',
        height: 300,
        // borderRadius: 15,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white'}}
      >
        <Text style={{textAlign: 'center',fontSize: 20,backgroundColor: 'transparent'}}>
          {item.joDate} - {index}
        </Text>
      </View>
    )
  };

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
  };

  swipeLeft = () => {
    this.swiper.swipeLeft()
  };

  render() {

    if (this.state.dataSource == 'EMPTY') {      
        offerComponent = (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.emptyJob}>
              <Image style={{width: 120, height: 120, margin: 30}} source={require('../components/images/staffextralogo.png')} resizeMode='cover' />  
              <Text style={{fontFamily: 'Abecedary', fontSize: 30}}> Nessun Offerta </Text>
            </View>
          </View>
        )
    } 
    else {
      offerComponent = (
        <Fragment>
          
          <Swiper
                ref={swiper => {
                  this.swiper = swiper
                }}
                containerStyle={{backgroundColor: 'transparent'}}
                // onSwiped={() => this.onSwiped('general')}
                // onSwipedLeft={() => this.onSwiped('left')}
                // onSwipedRight={() => this.onSwiped('right')}
                // onSwipedTop={() => this.onSwiped('top')}
                // onSwipedBottom={() => this.onSwiped('bottom')}
                // onTapCard={this.swipeLeft}
                cards={this.state.dataSource}
                cardIndex={this.state.ActiveSlide}
                // cardVerticalMargin={80}
                renderCard={this._renderItem}
                onSwipedAll={this.onSwipedAllCards}
                stackSize={5}
                stackSeparation={15}
                animateOverlayLabelsOpacity
                animateCardOpacity
                swipeBackCard
          >
          </Swiper>

          {/* <Button onPress={() => this.swiper.swipeBack()} title='Swipe Back' /> */}

          {/* <Button
                  title='Elimina Scheda'
                  onPress={this.removeCard}
                  color={Colors.primary}
          /> */}

        </Fragment>

        
        
      );

    }


    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
       )
    }

    return(
      <View style={{flex: 1}}>
          <ImageBackground source={require('../components/images/clipdesk.jpg')} style={styles.backgroundImage} >
            <View style={{flex: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                <Text style={styles.title}>{'Offerte di Lavoro'}</Text>
            </View>

            <View style={styles.clipboard}>
              
              {offerComponent}

            </View>

            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button,styles.red]} onPress={()=>{
                    this.swiper.swipeLeft();
                  }}>
                    <Image style={{width: 50, height: 50}} source={require('../components/images/red.png')} resizeMode={'cover'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button,styles.orange]} onPress={() => {
                    this.swiper.swipeBack();
                  }}>
                    <Image source={require('../components/images/back.png')} resizeMode={'cover'} style={{ height: 32, width: 32, borderRadius: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button,styles.green]} onPress={()=>{
                    this.swiper.swipeRight();
                  }}>
                    <Image source={require('../components/images/green.png')} resizeMode={'contain'} style={{ height: 62, width: 62 }} />
                  </TouchableOpacity>
                </View>
            </View>



          </ImageBackground>
          <NavigationEvents onDidFocus={()=>this.fetchData()} />
      </View>
      );
    
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
		flex: 1,
		// justifyContent: 'center',
		resizeMode: 'cover', // or 'stretch'
	},
  clipboard: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 14,
    // alignItems: 'center',
  },
  title: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  TextStyle: {
    fontSize: 25,
    textAlign: 'center',
  },
  emptyJob:
  {
    flexDirection: 'column',
    width: '70%',
    height: 300,
    backgroundColor: Colors.grey5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grey4,
    borderWidth: 2,
    marginTop: 20,
  },
  footer:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  buttonContainer:{
    width:300,
    flexDirection:'row',
    justifyContent: 'space-between',
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
    borderColor:'rgb(246,190,66)',    
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },  
  
});
