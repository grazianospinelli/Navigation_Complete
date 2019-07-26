import React, { Component, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Image, AsyncStorage, Button } from 'react-native';
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
      // dataSource: null,
      ActiveSlide: null,
      currentIndex: null
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
          // console.log(responseJson);
          this.setState({dataSource: responseJson});
          this.setState({loading: false});
          this.setState({ActiveSlide: this.state.dataSource.length - 1});
        })
        .catch(error=>console.log(error)) //to catch the errors if any
    })
    .catch(error=>console.log(error))
  }
  
  componentDidMount() {
    this.fetchData();
    FireManager();
  }

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

  
  _renderItem ({item, index}) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
  }

  removeCard = () => {
    if (this._carousel) {   
      console.log('currentIndex: '+this._carousel.currentIndex);
      console.log('stateIndex: '+this.state.ActiveSlide);
      console.log(this.state.dataSource);
      if (this._carousel.currentIndex == this.state.dataSource.length - 1) {
        if (this._carousel.currentIndex == 0) {
          // No item left in carousel
          this.props.navigation.pop()
        } else {
          console.log('ID1:'+this.state.dataSource[this._carousel.currentIndex].joID)
          this.state.dataSource.splice(this._carousel.currentIndex, 1)
          this._carousel.snapToPrev()
        }
      } else {

        let temp = this.state.dataSource.slice()
        console.log('ID2:'+this.state.dataSource[this._carousel.currentIndex].joID)
        temp.splice(this._carousel.currentIndex, 1)
        
        this.setState({dataSource: temp}, () => {this._carousel.snapToNext()} )
      }
    }
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
              // data={this.state.dataSource.reverse()}
              // firstItem={SLIDER_1_FIRST_ITEM}
              firstItem={this.state.dataSource.length - 1}
              containerCustomStyle={{ transform: [{ scaleX: 1 }] }}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              // containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              layoutCardOffset={15}
              useScrollView={true}
              layout={'stack'}
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
    console.log('job ID: '+this.state.dataSource[this.state.ActiveSlide].joID);
    
    return(
        <View style={styles.container}>

          { this.gradient }

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
