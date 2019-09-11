import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {getWeekDay, getYear, getMonth} from './DateUtility';
import * as Colors from '../components/themes/colors';

export default class ClipPage extends Component {

    constructor(props){
        super(props)
    }
    
    render () {
        // Assegnazione di tipo DESTRUCTURED ES6
        const { data: { joID, joDate, joTime, joPay, joNote, joMansion, resName, resAddress, resCity, resProv, resTel }, even} = this.props;

        switch(even) {
            case(0):
            var caseStyle=Colors.primary;
            break;
            case(1):
            var caseStyle='#00d6d6';
            break;
            case(2):
            var caseStyle=Colors.tertiary;
            break;
            case(3):
            var caseStyle=Colors.quaternary;
            break;        
        }
        
        return (
                   
                // <View style={[styles.textContainer, this.state.caseStyle]}>
                <View style={styles.jobStyle}>

                    <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 10}}>
                        <Text style={{fontWeight: 'bold', fontSize: 12, color: caseStyle}}> {getWeekDay(joDate)} </Text>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: caseStyle,}}> {joDate.split('-')[2]+' '}</Text>
                        <Text style={{fontSize: 15, color: caseStyle}}>
                            {getMonth(joDate)+' '+ getYear(joDate)}
                        </Text>
                    </View>
                    <View style={[styles.Ribbon, {backgroundColor: caseStyle}]}>
                        <Text style={styles.title} numberOfLines={2}> {resName} </Text>
                        <Text style={styles.subtitle} numberOfLines={2}> {resAddress} </Text>
                        <Text style={styles.subtitle}> {resCity+' - ('}
                        {resProv?resProv:'--'}{')'} </Text>                       
                        <Text style={styles.subtitle}>{'Tel: '+resTel}</Text>
                    </View>

                    <Text style={{paddingVertical: 5, fontWeight: 'bold', fontSize: 12, color: caseStyle}}>RICERCA:</Text>

                    <View style={styles.showOffer}>
                        <Text style={[styles.notes, {fontSize: 15, fontWeight: 'bold', marginBottom: 5}]}>{joMansion.toUpperCase()}</Text> 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>ORE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{joTime.substr(0,5)}</Text>                            
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>PAGA: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic',}]}>{joPay}{' €'}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.notes, {fontWeight: 'bold'}]}>NOTE: </Text>
                            <Text style={[styles.notes, {fontStyle: 'italic'}]} numberOfLines={3} ellipsizeMode='tail'>{joNote?joNote:'  - - -'}</Text>
                        </View>
                    </View>           
                    
            
                </View>
                                    
        );
    }
}

const styles = StyleSheet.create({
    jobStyle: {
        width: '74.72%',
        height: 310,
        marginTop: 55,
        backgroundColor: '#e9e9e9',
        borderColor: '#b5b5b5',
        borderBottomWidth: 2,
        borderTopWidth: 1,
        // borderStyle: 'dashed',
        // borderRadius: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    Ribbon: {
        width: '100%',
        paddingVertical: 8,
        // height: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontFamily: 'Abecedary',
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        // letterSpacing: 0.5,
    },
    subtitle: {
        paddingHorizontal: 5,
        color: 'white',
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    showOffer: {
        flex: 1,
        width: '85%',
        // marginTop: 12,
        marginBottom: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Colors.grey4,    
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',    
    },
    notes: {
        color: Colors.grey1,
        fontSize: 12,        
        textAlign: 'center',
    }    
});
