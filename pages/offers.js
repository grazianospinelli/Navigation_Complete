import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, AsyncStorage } from 'react-native';
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

const SLIDER_1_FIRST_ITEM = 1;

export default class OfferScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      loading: true,
      // dataSource:[],
      dataSource: null,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
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

        { this.gradient }

        <View style={styles.exampleContainer}>
                        <Text style={styles.title}>{'Offerte di Lavoro'}</Text>
                        
                        <Carousel
                          data={this.state.dataSource.reverse()}
                          firstItem={this.state.dataSource.length - 1}
                          containerCustomStyle={{ transform: [{ scaleX: -1 }] }}
                          renderItem={this._renderItem}
                          sliderWidth={sliderWidth}
                          itemWidth={itemWidth}
                          containerCustomStyle={styles.slider}
                          contentContainerCustomStyle={styles.sliderContentContainer}
                          layout={'stack'}
                          loop={false}
                        />
        </View>

        {/* <ScrollView>
          <Text>{JSON.stringify(this.state.dataSource, null, 2)}</Text>
        </ScrollView> */}
      </View>
    );
  }
}
