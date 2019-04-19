import React, { Component } from 'react';
import { Image, ScrollView, } from 'react-native';

// Non più utilizzato
// Il modulo si occupa di ripetere un immagine backgroud 
// all'interno di un componente ScrollView

export default class ScrollViewWithBg extends Component {
  constructor (props) {
    super(props);

    this.state = {contentSize: {width: 0, height: 0}}
  }

  render () {
    const bgStyles = {
      position: 'absolute',
      resizeMode: 'repeat',
      width: this.state.contentSize.width,
      height: this.state.contentSize.height,
    };

    return (
      <ScrollView
        onContentSizeChange={(width, height) => this.setState({contentSize: {width, height}})}>

        <Image
          source={require('../components/images/notebook_rings.jpg')}
          style={bgStyles} />

        {this.props.children}

      </ScrollView>
    );
  }
}
