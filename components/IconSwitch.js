import React, { Component } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const IconSwitch = (props) => (
    <View style={styles.SWForm}>	
        <Icon style={{ }} size={20} name={props.iconName} />
        <Text style={{ marginLeft: 15, fontSize: 16}}>{props.label}</Text> 

        <View style={{ flex: 1, alignItems: 'flex-end' }}>	
            <Switch
                {...props}
            />
        </View>
    </View>
)

const styles = StyleSheet.create({

    SWForm: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center', 
        height: 50,
        borderBottomWidth: .2,
        borderColor: 'gray',
    }

});

export default IconSwitch