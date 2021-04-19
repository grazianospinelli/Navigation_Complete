import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, ImageBackground, Image } from 'react-native';
import * as Colors from '../components/themes/colors';
import AppIntroSlider from 'react-native-app-intro-slider';


const slides = [
  {
    key: 'zero',
    title: 'Benvenuto !',
    text: 'ExtraStaff è la prima App dedicata\n a chi lavora nella ristorazione\n e cerca un extra o un posto fisso\nL\'App è completamente gratuita\n perchè visualizza Pubblicità\nL\'App riceve le Offerte di Lavoro dai ristoratori\nche sono iscritti al Portale www.ExtraStaff.it',
    image: require('../components/images/staffextralogo.png'),
    backgroundColor: Colors.primary,
    // imageStyle: styles.intro,
  },
  {
    key: 'one',
    title: 'Inserisci foto e dati!',
    text: 'Ricorda di inserire Provincia e Città per ricevere\n offerte di lavoro nella zona in cui ti trovi\nDopo ogni servizio potresti ricevere\n una valutazione in stelline',
    image: require('../components/images/profile.jpg'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  },
  {
    key: 'two',
    title: 'Che Extra cerchi?',
    text: 'Riceverai offerte di lavoro\nin base alle competenze selezionate\nSpecifica se conosci una lingua\nDescrivi brevemente cosa sai fare',
    image: require('../components/images/skills.jpg'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  },
  {
    key: 'three',
    title: 'Le tue Offerte!',
    text: 'Scorri per selezionare l\'offerta che ti piace\nSe accetti, l\'offerta diventerà un impegno\n e non riceverai più offerte per quel giorno\nSe non rispetti o disdici un impegno riceverai 1 stella!\nRicarica per visualizzare nuove offerte!',
    image: require('../components/images/offers.jpg'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  },
  {
    key: 'four',
    title: 'I tuoi Impegni!',
    text: 'In questa lista hai tutti i tuoi impegni sotto controllo\nPremi sugli impegni per maggiori info\nPuoi anche aggiungere un impegno personale\n e non riceverai offerte per quel giorno già impegnato',
    image: require('../components/images/jobs.jpg'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  },
  {
    key: 'five',
    title: 'Ecco un Impegno',
    text: 'Qui compaiono le info principali come ora e paga\nDa qui puoi inviare un messaggio al datore di lavoro\nSe premi sul Cestino puoi disdire l\'impegno\nma verrai penalizzato con 1 stella',
    image: require('../components/images/imp-123.png'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  },
  {
    key: 'six',
    title: 'Il tuo Calendario',
    text: 'In rosso ci sono i giorni occupati\nIn giallo i giorni in cui hai ricevuto offerte\nPremili per vederne la descrizione\n e tenere tutto sotto controllo!',
    image: require('../components/images/agenda.jpg'),
    backgroundColor: '#696969',
    // imageStyle: styles.image,
  }
];


export default class introTutorial extends Component {  
  constructor(props){
    super(props)
      this.state = {
        showRealApp: false
      }
  }

  _renderItem = ({item,index}) => {
    // const {item, index, dimensions, bottomButton} = this.props;
    const style = {      
        backgroundColor: item.backgroundColor,      
        // width: dimensions.width,
        // height: dimensions.height,
        // flex: 1,     
        // paddingBottom: bottomButton ? 132 : 64,
    };
    return (      
      <View style={[styles.slide, style]}>
        <Text style={styles.title}>{item.title}</Text>
        {(index===0)?
          <Image style={styles.intro} resizeMode='contain' source={item.image} />
          :
          <Image style={styles.image} resizeMode='contain' source={item.image} />
        }
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    this.props.navigation.navigate("Drawer");
  }

  _onSkip = () => {
    this.props.navigation.navigate("Drawer");
  }
  
  render() {  
    return <AppIntroSlider 
              renderItem={this._renderItem} 
              slides={slides} 
              showSkipButton
              skipLabel='Salta'
              doneLabel='Fatto'
              nextLabel='>>'
              onSkip={this._onSkip} 
              onDone={this._onDone}
            />;        
  }
}

const styles = StyleSheet.create({  
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // justifyContent: 'center',
    // backgroundColor: '#696969',
  },
  image: {
    width: 400,
    height: 390,
    marginVertical: 5,
    resizeMode: 'contain'
  },
  intro: {
    width: 300,
    height: 300,    
    resizeMode: 'contain'
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: "600"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});