import React, { Component } from 'react';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Image, ScrollView, AsyncStorage } from 'react-native';
import { USER_NAME } from './auth';
import * as Colors from './themes/colors';

export default class DrawerContainer extends Component {

    constructor(props){
		super(props)
		this.state={
			user:''
        }
    }

    componentWillMount(){
        AsyncStorage.getItem(USER_NAME)
        .then((userName) => {
            this.setState({user: userName});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <ImageBackground source={require('./images/Background3.jpg')} style={{flex: 1, width: 300, justifyContent: 'center'}} >
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                            <Image 
                                style={styles.drawerImage}
                                source={require('./images/staffextralogo.png')}
                                resizeMode='cover'
                            />
                            
                            <Text style={styles.greet} numberOfLines={1} ellipsizeMode='tail'>C  iao, {this.state.user}</Text>                          
                            
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ height: 20 }}><Text>{}</Text></View>
                <ScrollView>
                    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                        <DrawerItems {...this.props} labelStyle={{
                                color: Colors.secondary, 
                                fontSize: 15,
                                // Per dare un font agli elem del Drawer:
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
        flex: 1,    // Con questo copriamo tutto il Drawer di nero
    },
    drawerImage: {
        margin: 5,
        height: 110,
        width: 110,
        // borderRadius: 75
    },
    headerContainer: {
        height: 150,
    },
    greet: {
        margin: 5,
        width: 160,
        alignItems: 'center',        
        color: Colors.primary,
        fontFamily: 'Wildemount Rough',
		fontSize: 35,		
    },
    headerText: {
        color: Colors.secondary,
    },
    
});