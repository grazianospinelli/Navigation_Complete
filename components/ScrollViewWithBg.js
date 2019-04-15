import React, { PureComponent } from 'react';
import { Image, ScrollView, } from 'react-native';

export default class ScrollViewWithBg extends PureComponent {
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
          source={require('../components/images/notebook.jpg')}
          style={bgStyles} />

        {this.props.children}

      </ScrollView>
    );
  }
}
