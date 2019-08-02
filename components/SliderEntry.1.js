import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './themes/SliderEntry.style';

export default class SliderEntry extends Component {

    render () {
        const { data: { joDate, joTime, joPay, joNote, resName, resAddress, resCity }, even } = this.props;

        const uppercaseTitle = resName ? (
            <Text 
                style={[styles.title, even ? styles.titleEven : {}]}
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
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    {/* { this.image } */}
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { joDate }
                    </Text>
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { joTime }
                    </Text>
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { joPay }
                    </Text>
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { joNote }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}