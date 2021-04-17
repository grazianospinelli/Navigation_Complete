import React, {Component, Fragment} from 'react';
import { View, TouchableOpacity, Image, Text, FlatList, StyleSheet, 
        LayoutAnimation, Platform, UIManager} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import * as Colors from './themes/colors';
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import IP from '../config/IP';
import { USER_UUID } from '../components/auth';

export default class Accordion extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            restaurantImage: !!(this.props.photo)?`${IP}/Profiles/${props.uuid}.jpg`
                                                :`${IP}/Profiles/restaurant-placeholder.jpg`,
            userUuid: '',
            data: props.data,
            expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount() {
		AsyncStorage.getItem(USER_UUID)
		.then((_userUuid) => {
			this.setState({userUuid: _userUuid});			
		});
	}

    onClick = (index)=>{
        this.props.navigation.navigate("Chat", {userUUID: this.state.userUuid,
                                                restUUID: this.props.uuid, 
                                                date: this.state.data[index].key,
                                                restImage: this.state.restaurantImage,
                                                restName: this.props.title})
        // const temp = this.state.data.slice()
        // temp[index].value = !temp[index].value
        // this.setState({data: temp})
        // alert(`${this.props.uuid}+${this.state.data[index].key}`)
    }

    
    toggleExpand=()=>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({expanded : !this.state.expanded})
    }


    render() {
        return (
            <Fragment>                
                <View style={styles.row}>
                    <View>
                        <Image style={styles.avatar} resizeMode='cover' source={{uri: `${this.state.restaurantImage}` }}/>
                        {(this.props.unchecked>0) && 
                        <View style={[styles.badge, {position: 'absolute', top: 5, right: 0}]}> 
                            <Text style={styles.badgeText}>{this.props.unchecked}</Text>
                        </View>}
                    </View>
                    <Text style={[styles.title]} numberOfLines={2}>{this.props.title}</Text>
                    <TouchableOpacity style={{justifyContent: 'center',	alignItems: 'center'}} onPress={()=>this.toggleExpand()}>
                        <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={Colors.DARKGRAY} />                    
                    </TouchableOpacity>
                </View>
                <View style={styles.parentHr}/>
                {
                    this.state.expanded &&
                    <View style={{}}>
                        <FlatList
                            data={this.state.data}
                            numColumns={1}
                            scrollEnabled={false}                        
                            renderItem={({item, index}) => 
                                <View style={styles.elements}>
                                    <View style={[styles.childRow, styles.button]}>
                                        <Text style={[styles.font, styles.itemInActive]} >{'Evento del '+moment(item.key).format("DD-MM-YYYY")}</Text>
                                        {/* <Icon name={'check-circle'} size={24} color={ item.value ? Colors.GREEN :  Colors.LIGHTGRAY } /> */}
                                        {(item.unc>0) && 
                                            <View style={styles.badge}> 
                                                <Text style={styles.badgeText}>{item.unc}</Text>
                                            </View>
                                        }
                                        <TouchableOpacity style={{justifyContent: 'center',	alignItems: 'center'}} onPress={()=>this.onClick(index)}>
                                            <Icon name={'keyboard-arrow-right'} size={24} color={Colors.DARKGRAY} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.childHr}/>
                                </View>
                            }
                            // keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                }                
            </Fragment>
        )
    }   

}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        width:'100%',
        height:54,
        alignItems:'center',
        paddingLeft:35,
        paddingRight:35,
        fontSize: 12,
    },
    title:{
        flexShrink: 1,
        fontSize: 14,
        fontWeight:'bold',
        color: Colors.DARKGRAY,
    },
    itemActive:{
        fontSize: 12,
        color: Colors.GREEN,
    },
    itemInActive:{
        marginLeft: 15,
        fontSize: 14,
        color: Colors.DARKGRAY,
    },
    btnActive:{
        borderColor: Colors.GREEN,
    },
    btnInActive:{
        borderColor: Colors.DARKGRAY,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height: 80,
        paddingLeft:10,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: Colors.CGRAY,
    },
    avatar: {
        flex: 0,
        width: 75,
        height: 75,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: "white",
        marginVertical:5,
        alignSelf:'center',
    },
    badge: {
        // flex: 0,
        width: 20,
        height: 20,
        borderRadius: 75,
        backgroundColor: Colors.primary,
        alignItems:'center',
        justifyContent: 'center'
    },
    badgeText: {
        fontSize: 10,
        fontWeight:'bold',
        color: '#FFF',
    },
    elements: {

    },
    childRow:{
        flexDirection: 'row',
        justifyContent:'space-between',
        // borderRadius: 75,
        // paddingHorizontal: 20,
        backgroundColor: Colors.sheet2,
    },
    parentHr:{
        height:1,
        color: Colors.WHITE,
        width:'100%'
    },
    childHr:{
        height:1,
        backgroundColor: Colors.LIGHTGRAY,
        width:'100%',
    },
    colorActive:{
        borderColor: Colors.GREEN,
    },
    colorInActive:{
        borderColor: Colors.DARKGRAY,
    }
    
});