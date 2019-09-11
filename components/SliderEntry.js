import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './themes/SliderEntry.style';

export default class SliderEntry extends Component {

    constructor(props){
        super(props)
        this.state = {
          caseStyle: null
        }
    }

    componentWillMount() {
        console.log(this.props.even);
        switch(this.props.even) {
            case(0):
            this.setState({caseStyle: styles.textContainer1});
            break;
            case(1):
            this.setState({caseStyle: styles.textContainer2});
            break;
            case(2):
            this.setState({caseStyle: styles.textContainer3});
            break;
            case(3):
            this.setState({caseStyle: styles.textContainer4});
            break;        
        }
    }

    render () {
        // Assegnazione di tipo DESTRUCTURED ES6
        const { data: { joDate, joTime, joPay, joNote, resName, resAddress, resCity }, even } = this.props;
        


        const uppercaseTitle = resName ? (
            <Text 
                style={[styles.title, {}]}
                numberOfLines={2}
            >
                { resName.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { alert(`You've clicked '${joDate}'`); }}
              >
                <View style={styles.shadow} />
                
                <View style={[styles.textContainer, this.state.caseStyle]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle,  {}]}
                      numberOfLines={2}
                    >
                        { joDate }
                    </Text>
                    <Text
                      style={[styles.subtitle, {}]}
                      numberOfLines={2}
                    >
                        { joTime }
                    </Text>
                    <Text
                      style={[styles.subtitle, {}]}
                      numberOfLines={2}
                    >
                        { joPay }
                    </Text>
                    <Text
                      style={[styles.subtitle, {}]}
                      numberOfLines={2}
                    >
                        { joNote }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}