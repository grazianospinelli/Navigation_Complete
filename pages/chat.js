import React, { Component } from 'react';
import {
	ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity,
	Text, TextInput, TouchableHighlight, View, Linking, Clipboard
} from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { NavigationEvents } from 'react-navigation';
import moment from "moment";

import IP from '../config/IP';

export default class ChatScreen extends Component {
	
	constructor(props){
		super(props)
		this.state = {
			restUUID: this.props.navigation.getParam('restUUID'),
			date: this.props.navigation.getParam('date'),
			restImage: this.props.navigation.getParam('restImage'),
			restName: this.props.navigation.getParam('restName'),
			userUUID: this.props.navigation.getParam('userUUID'),									
			loading: true,
			data: null,
			messages: [],
			newMessage: '',
			loading: false,
			intervalHandler: null								
		  };
		
	}

	showProgressBar() {
		this.setState({loading: true})
	}

	hideProgressBar() {
		this.setState({loading: false})
	}	

	update() {		
		if (!this.state.intervalHandler) {
			this.interval = setInterval(()=>{this.getMessages(false)},10000);
			this.setState({intervalHandler: this.interval})
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalHandler);
	}
	
	componentDidMount() {
		this.getMessages(true);
		this.update();
	}
	
	scrollToTheBottom() {
		this.refs.list.getScrollResponder().scrollTo({y: 0});
	}

	getMessages(showProgressBar) {		
		if (showProgressBar)
			this.showProgressBar();	
		fetch(`${IP}/getMessages.php`,{
			method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				// we will pass our input data to server
				touuid: this.state.userUUID,
				fromuuid: this.state.restUUID,
				date: this.state.date
			})
		})
		.then((response) => response.json())		
		.then((responseData) => {
		if (showProgressBar)
			this.hideProgressBar();
		console.log(responseData);
		var messagesCopy = responseData;
		var oldMessagesNumber = this.state.messages.length;
		// messagesCopy.reverse();
		this.setState({
			messages: messagesCopy,
			data: messagesCopy,
		});
		if (oldMessagesNumber < messagesCopy.length)
			this.scrollToTheBottom();
		})
		.catch(error=>console.log(error)) // fetch error    
  	}

	sendNewMessage() {
	var message = this.state.newMessage;
		if (message) {
			console.log(this.state.messages)
			this.refs['newMessage'].setNativeProps({text: ''});
			var messagesCopy = this.state.messages.slice();			
			messagesCopy.push({mesID: Math.random(), mesFromUUID: this.state.userUUID, mesToUUID: this.state.restUUID, mesText: message})
			// console.log(messagesCopy)
			this.setState({
				data: messagesCopy,
				messages: messagesCopy,
				newMessage: '',
			});
			this.scrollToTheBottom();
			// fetch(SERVER_ADD_MESSAGES_URL + '?id=' + this.props.id + '&password=' + this.props.password + '&contact_id=' + this.props.contactId + '&message=' + message)
			fetch(`${IP}/setMessages.php`,{
				method:'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					touuid: this.state.restUUID,
					fromuuid: this.state.userUUID,
					date: this.state.date,
					text: message					
				})
			})
			.then((response) => response.json())
			.then((responseData) => {console.log(responseData)}).done();
		}
	}

	_goToURL(url) {		
		Linking.canOpenURL(url).then(supported => {
		  if (supported) {
			Linking.openURL(url);
		  } 
		});
	}
	
	renderMessage(message) {		
		if (message.mesFromUUID === this.state.userUUID) {
		return (
			<View style = {styles.userMessageRow}>
			<View style = {styles.userMessageContainer}>
				<Text 
					style = {styles.messageText}
					// style = {[hypLink ? styles.hyperlinkText : styles.messageText ]}
					selectable={true} 
					onLongPress={()=>Clipboard.setString(message.mesText)} 
					onPress={()=>this._goToURL(message.mesText)}>
				{message.mesText}
				</Text>
			</View>
			</View>
		);
		} else {
		return (
			<View style = {styles.contactMessageRow}>
			<View style = {styles.contactMessageContainer}>
				<Text 
					style = {styles.messageText}
					// style = {[hypLink ? styles.hyperlinkText : styles.messageText ]}
					selectable={true}
					onLongPress={()=>Clipboard.setString(message.mesText)}
					onPress={()=>this._goToURL(message.mesText)}>
				{message.mesText}
				</Text>
			</View>
			</View>
		);
		}		
	}

	Toolbar=()=> {		
		return (
		<View style = {styles.toolbar}>
			<TouchableOpacity
				onPress={() => {this.props.navigation.goBack()}}>
				<Icon style={{ padding: 10 }} name="arrow-left" size={25} color={'white'} />
			</TouchableOpacity>
			<Image style={styles.avatar} resizeMode='cover' source={{uri: `${this.state.restImage}` }}/>
			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.toolbarTitle}>{this.state.restName}</Text>
		</View>
		);
	}
		
  	render() {	

		if (this.state.loading) {
			return (
			  <View style = {styles.mainContainer}>
				<this.Toolbar />
				<View style = {styles.progressBarContainer}>
					<ActivityIndicator size="large" color="#0c9"/>
				</View>
			  </View>
			);
		  } else {
			return (
			  <View style={styles.mainContainer}>
				<NavigationEvents
					// onDidFocus con update triggerava 2 volte in fase di mounting di Chat il setInterval.
					// Salvando l'handler dell'intervallo nello stato verifico in update() se è stato già lanciato setInterval.
					// Quando perdo il focus dalla Chat usando il drawer cancello l'Handler così in update viene rilanciato
					// setInterval quando la Chat ha di nuovo il focus con onDidFocus.
					onDidFocus={()=>this.update()}
					onDidBlur={()=>{clearInterval(this.state.intervalHandler); this.setState({intervalHandler: null})}}
				/>
				<this.Toolbar />
				<View style={{flex: 0, width: '100%', alignItems: 'center'}}>
					<View style={styles.badge}> 
						<Text style={styles.badgeText}>{'Evento del '+moment(this.state.date).format("DD-MM-YYYY")}</Text>
					</View>
				</View>	
				<View style = {styles.contentContainer}>					
					<FlatList
						ref = "list"
						onContentSizeChange={()=> this.refs.list.scrollToEnd()}
						// renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
						data = {this.state.data}										
						renderItem = {({item: rowData}) => this.renderMessage(rowData)}
						keyExtractor={item => item.mesID.toString()}
						style = {styles.listView} 
					/>
					<View style = {styles.inputAndSendView}>
					<TextInput 
						ref = {'newMessage'}
						style = {styles.inputMessage}
						placeholder = {'Scrivi un messaggio'}
						text = {this.state.newMessage}
						maxLength={199}
						onChangeText = {(e) => this.setState({newMessage: e})} />
					<TouchableHighlight 
						style = {styles.sendButton}
						onPress = {() => this.sendNewMessage()}> 
						<Text style = {styles.whiteText}>
							INVIA
						</Text>
					</TouchableHighlight>
					</View>
				</View>
			  </View>
			);
		  }
	}

	
}

const styles = StyleSheet.create({
	contentContainer: {
		backgroundColor: '#f5fcff',
		flex: 1,
	},
	messageText: {
		color: 'black',
	},
	hyperlinkText: {
		color: 'blue',
		textDecorationLine: 'underline',
	},
	contactMessageContainer: {
		alignItems: 'center',
		backgroundColor: Colors.LIGHTGRAY,
		borderRadius: 5,
		justifyContent: 'center',
		marginVertical: 5,
		marginRight: 40,
		marginLeft: 10,
		paddingHorizontal: 5,
		paddingVertical: 8
	},
	contactMessageRow: {
		alignItems: 'flex-start',
	},
	listView: {
		backgroundColor: '#f5fcff',
		flex: 1,
	},
	inputAndSendView: {
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		borderColor: Colors.DARKGRAY,
		borderStyle: 'solid',
		borderTopWidth: 2,
		flexDirection: 'row', 
		height: 40,
		justifyContent: 'center',
		marginTop: 10
	},
	inputMessage: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		textAlign: 'center',
	},
	inputView: {
		alignItems: 'center',
		flex: 80,
		justifyContent: 'center',
	},
	mainContainer: {
		flex: 1,
		backgroundColor: '#f5fcff',
		// alignItems: 'center'
	},
	progressBarContainer: {
		alignItems: 'center',
		backgroundColor: '#f5fcff',
		flex: 1,
		justifyContent: 'center',
	},
	sendButton: {
		alignItems: 'center',
		backgroundColor: Colors.DARKGRAY,
		height: 40,
		justifyContent: 'center',
		padding: 5,
		width: 80,
	},
	sendButtonView: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	toolbar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.primary,
		height: 80,
	},
	toolbarTitle: {
		flex: 1,  // Ellipse non funziona se non è specificato
		color: 'white',
		fontSize: 20,
        fontWeight:'bold',
	},
	avatar: {
        flex: 0,
        width: 70,
        height: 70,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: "white",
        marginRight: 10,
        alignSelf:'center',
    },
	userMessage: {
		color: 'black',
	},
	userMessageContainer: {
		alignItems: 'center',
		backgroundColor: Colors.secondary,
		borderRadius: 5,
		justifyContent: 'center',
		marginVertical: 5,
		marginRight: 10,
		marginLeft: 40,
		paddingHorizontal: 5,
		paddingVertical: 8
	},
	userMessageRow: {
		alignItems: 'flex-end',
	},
	whiteText: {
		color: 'white',
		fontSize: 14,
        fontWeight:'bold',
	},
	badge: {
        // flex: 0,
        width: '50%',
        height: 20,
        borderRadius: 75,
        backgroundColor: Colors.primary,
        alignItems:'center',
		justifyContent: 'center',
		margin: 5
    },
    badgeText: {
        fontSize: 12,
        fontWeight:'bold',
        color: '#FFF',
    },
});