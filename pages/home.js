import React, { Component } from 'react';
import { AppRegistry,View,Text,StyleSheet,TouchableOpacity,StatusBar,ImageBackground, BackHandler } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';
export default class home extends Component{

	render(){

		const { navigate } = this.props.navigation;
		
		backPage=(
		<TouchableOpacity 
			style={{position:'absolute',left:0,top:0,margin: 5}} 
			onPress={() => BackHandler.exitApp()}>
				<Icon style={{ padding: 5 }} name="close" size={25} color={Colors.secondary} />  
		</TouchableOpacity>);

		
		return(
		<ImageBackground 
			source={require('../components/images/waiter.jpg')}
			style={styles.backgroundImage}
		>
			<View style={styles.container}>
			<StatusBar backgroundColor = '#000' translucent={false} barStyle='light-content' />
			{backPage}
			
				<Text style={styles.pageName}>Benvenuto !</Text>

				<TouchableOpacity
					onPress={() => navigate('Login')}
					style={[styles.button, { backgroundColor: Colors.secondary }]}>
					<Text style={styles.btnText}>Entra</Text>
				</TouchableOpacity>
				
				<TouchableOpacity		
					onPress={()=> navigate('Register')}
					style={[styles.button, { backgroundColor: Colors.primary }]}>
					<Text style={styles.btnText}>Registrati</Text>
				</TouchableOpacity>
			
			
			</View>
			<View style={{flex:0, justifyContent:'flex-end', alignItems:'center'}}>
				<Text style={{color: Colors.primary, fontWeight:'bold'}}>Nuovo Utente? Registrati e poi Entra!</Text>
			</View>
		</ImageBackground>
		);
	}
}
const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},
	container:{
		flex: 1, 
		alignItems:'center',
		justifyContent:'center'
	},
	button:{
		borderRadius: 25, 
		// width:150, 
		width: '50%', 
		margin: 20, 
		padding:5,
		alignItems:'center'
		// width:'95%'
	},
	pageName:{
		margin: 40,
		color: Colors.primary,
		fontFamily: 'Wildemount Rough',
		fontSize: 80
	},
	btnText:{
		color:'#fff',
		// fontWeight:'bold'
		fontFamily: 'Wildemount Rough',
		fontSize: 40
	},
	
});


AppRegistry.registerComponent('home', () => home);
