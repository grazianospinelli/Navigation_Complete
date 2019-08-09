import React, { Component, Fragment } from 'react';
import { View, ActivityIndicator, Text, Image, AsyncStorage, Button } from 'react-native';
import {NavigationEvents} from "react-navigation";
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import SliderEntry from '../components/SliderEntry';
import { sliderWidth, itemWidth } from '../components/themes/SliderEntry.style';
import styles from '../components/themes/index.style';
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
      ActiveSlide: null,      
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
          if (this.state.ActiveSlide === null) {this.setState({ActiveSlide: this.state.dataSource.length - 1});}          
          this.setState({loading: false});
          // console.log('State: ' +JSON.stringify(this.state));
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
  
  get gradient () {
    return (
        <LinearGradient
          colors={[Colors.background1, Colors.background2]}
          startPoint={{ x: 1, y: 0 }}
          endPoint={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
    );
  }


  _renderItem = ({item, index}) => {
    console.log(index+' --- '+this.state.dataSource[index].joID);
    return <SliderEntry data={item} even={(this.state.dataSource[index].joID + 1) % 4 } />;
    
  }

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
          <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.dataSource}
              firstItem={this.state.ActiveSlide}
              containerCustomStyle={{ transform: [{ scaleX: 1 }] }}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              contentContainerCustomStyle={styles.sliderContentContainer}
              layoutCardOffset={15}
              useScrollView={true}
              layout={'tinder'}
              loop={false}
              onSnapToItem={(index) => this.setState({ ActiveSlide: index }) }
          />

          <Button
                  title='Elimina Scheda'
                  onPress={this.removeCard}
                  color={Colors.primary}
          />
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

    console.log(this.state.dataSource);
    console.log('stateIndex: '+this.state.ActiveSlide);
    // console.log('job ID: '+this.state.dataSource[this.state.ActiveSlide].joID);
    
    return(
        <View style={styles.container}>

          {/* { this.gradient } */}

                <Text style={styles.title}>{'Offerte di Lavoro'}</Text>
          
                {offerComponent}
                
                {/* https://github.com/archriss/react-native-snap-carousel/issues/446
                {this._carousel && (
                    <Text style={{ margin: 8, textAlign: 'center' }}> {'index:'+this._carousel.currentIndex} </Text>
                )} */}
          
          <NavigationEvents onDidFocus={()=>this.fetchData()} />
          
          {/* 
            Per visualizzare velocemente tutto il vettore di dati scaricati dal server
            <ScrollView>
              <Text>{JSON.stringify(this.state.dataSource, null, 2)}</Text>
            </ScrollView> 
          */}

        </View>
      );
    
  }
}
