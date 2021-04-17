import React, { Component, Fragment } from 'react';
import { ImageBackground, View, ActivityIndicator, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from "react-navigation";
// import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import MySwiper from '../components/MySwiper.js';
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
    this.setState({loading: true});
    this.fetchData();
    this.setState({ActiveSlide: 0});
  }
  
  removeCard = async () => {
    this.swiper.swipeLeft();
    await fetch(`${IP}/deloffers.php`,{
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
        
        if ((this.state.dataSource.length - 1) == 0) {
            this.setState({dataSource: 'EMPTY'});            
          } else {
            // console.log('ID:'+this.state.ActiveSlide)
            // console.log(this.state.dataSource)
            // this.setState(prevState => ({ list: prevState.list.slice(1) })); togli il primo
            let temp = this.state.dataSource.slice()
            temp.splice(this.state.ActiveSlide, 1)
            this.setState({dataSource: temp})
            // console.log(this.state.dataSource)
          }

      }
      else {alert('Errore aggiornamento offerte di lavoro')}
    })
    .catch(error=>console.log(error))
  };
  
  swipeLeft = () => {
    this.swiper.swipeLeft()
  };


  get gradient () {
    return (
        <LinearGradient
          colors={[Colors.primary, Colors.sheet1]}
          startPoint={{ x: 0, y: 0 }}
          endPoint={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
    );
  }

  _renderItem = (item, index) => {
    return (
      <View style={{
        width: '84.1%',
        height: 300,
        marginTop: 10,
        // borderRadius: 15,
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 2,
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>

        { this.gradient }
        <Text style={{textAlign: 'center',fontSize: 20,backgroundColor: 'transparent'}}>
          {item.joDate} - {index}         
        </Text>
        <Text style={{textAlign: 'center',fontSize: 30}}>{item.joID}</Text>
      </View>
    )
  };

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
  };

  

  render() {

    if (this.state.dataSource == 'EMPTY') {      
        offerComponent = (
          <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <View style={styles.emptyJob}>
              <Image style={{width: 120, height: 120, margin: 20}} source={require('../components/images/staffextralogo.png')} resizeMode='cover' />  
              <Text style={{fontFamily: 'Abecedary', fontSize: 25}}> Nessun Offerta </Text>
            </View>
          </View>
        )
    } 
    else {
      offerComponent = (
        <Fragment>
          
          <MySwiper
                refSwiper={swiper => {this.swiper = swiper}}
                cards={this.state.dataSource}
                cardIndex={this.state.ActiveSlide}
                renderCard={this._renderItem}
                onSwipedAll={this.onSwipedAllCards}          
          >
          </MySwiper>

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
                  <TouchableOpacity style={[styles.button,styles.red]} onPress={this.removeCard}>
                    <Image style={{width: 50, height: 50}} source={require('../components/images/red.png')} resizeMode={'cover'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button,styles.orange]} onPress={() => {
                    this.swiper.swipeBack();
                  }}>
                    <Image source={require('../components/images/back.png')} resizeMode={'cover'} style={{ height: 32, width: 32, borderRadius: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button,styles.green]} onPress={this.reload}>
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
    marginLeft: '3.9%',
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
    height: 250,
    backgroundColor: Colors.grey5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grey4,
    borderWidth: 2,
    marginTop: 70,
    marginLeft: '10%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
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
