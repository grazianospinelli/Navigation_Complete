import React, { Component } from 'react';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from './themes/colors';

export default class DrawerContainer extends Component {
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <ImageBackground source={require('./images/Background3.jpg')} style={{flex: 1, width: 300, justifyContent: 'center'}} >
                        <Image 
                            style={styles.drawerImage}
                            source={require('./images/Immagine.jpg')}
                        />
                    </ImageBackground>
                </View>
                <View style={{ height: 20 }}><Text>{}</Text></View>
                <ScrollView>
                    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <DrawerItems {...this.props} labelStyle={{
                                color: Colors.secondary, 
                                fontSize: 15,
                                // fontFamily: 'Wildemount Rough',
                                // fontWeight:'200'
                        }}/>
                    </SafeAreaView>
                </ScrollView>

            </View>
        
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        color: Colors.primary,
        flex: 1,    // Con questo compriamo tutto il Drawer di nero
    },
    drawerImage: {
        marginLeft: 30,
        height: 100,
        width: 100,
        borderRadius: 75
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: Colors.secondary,
    },
    
});