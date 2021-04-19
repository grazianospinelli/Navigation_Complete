import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,Text,StatusBar, TouchableWithoutFeedback,
  View,TouchableOpacity,TextInput,ImageBackground,Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from 'react-native-animatable';
import md5 from 'md5';
import IP from '../config/IP';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { onSignIn } from "../components/auth";
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({
	userEmail: Yup
		.string()
		.required("↑ Inserire la mail!")
	  	.email('↑ Email non corretta'),
	userPassword: Yup
		.string()
		.required("↑ Inserire la Password!")
		.min(8,"↑ Password deve essere almeno 8 caratteri")
});



export default class login extends Component {
	
	constructor(props){
		super(props)
		this.state={
			// userEmail:'',
			// userPassword:'',
			userToken:'',			
		}
	}
	
	componentDidMount = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }

        const fcmToken = await firebase.messaging().getToken()
        if (fcmToken) {
        	// alert(fcmToken);
        	this.setState({userToken: fcmToken});
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        	if (fcmToken) {this.setState({userToken: fcmToken})}
		})  
	}

	
	login = (values) =>{
		
		const {userEmail, userPassword} = values;
		const userToken = this.state.userToken;
		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
	  		
		fetch(`${IP}/login.php`,{
			method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				// we will pass our input data to server
				email: upperEmail,
				password: md5Password,
				token: userToken
			})
			
		})
		.then((response) => response.json())
		.then((responseJson)=>{
				if(responseJson == "KO"){
					alert("Dettagli Errati o Errore di Connessione");
				}else{
					alert("Login effettuato con successo");
					const UUID = responseJson.uuid;
					const userName = responseJson.name;
					// alert(UUID+' '+userName);
					onSignIn(this.upperEmail,this.md5Password,UUID,userName);
					// redirect to profile page
					// this.props.navigation.navigate("Drawer");
					this.props.navigation.navigate("Tutorial");
					
				}
		})
		.catch((error)=>{alert(error); throw error;});
					
		Keyboard.dismiss();
	}
	
  	render() {
	
	const { navigate } = this.props.navigation;
	
	return(
	<ImageBackground 
		source={require('../components/images/maid.jpg')}
		style={styles.backgroundImage}>

		<View style={{justifyContent: 'flex-start',	alignItems: 'flex-start'}}>
			<TouchableOpacity
				onPress={() => {this.props.navigation.navigate("Home")}}>
				<Icon style={{ padding: 10 }} name="arrow-left" padding={15} size={25} color={Colors.primary} />
			</TouchableOpacity>
		</View>

		<Formik
				initialValues={{userEmail:'',userPassword:''}}
				onSubmit={values => this.login(values)}
				validationSchema={myvalidationSchema}
		>
		
		{({ values, errors, setFieldValue, touched, setFieldTouched, isValid, handleSubmit }) => (

		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			
			<View style={styles.container}>
				<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />
				
				<TouchableOpacity onPress={handleSubmit}>
					{ isValid ? 
					(<Animatable.Text animation="rubberBand" iterationCount="infinite" easing="linear" style={styles.pageName}>
							{'→Entra←'}
					</Animatable.Text>):
					<Text style={styles.pageName}>{'Entra'}</Text>}
				</TouchableOpacity>

				<View style={styles.inputForm}>
					<Icon style={styles.searchIcon} name="envelope" size={20} color={errors.userEmail && touched.userEmail ? Colors.primary : Colors.grey1}  />		
					<TextInput
						placeholder="Inserisci Email"
						value={values.userEmail}
						style={{borderRadius: 25, width:180}}
						onChangeText={text => setFieldValue("userEmail", text.trim())}
						onBlur={() => setFieldTouched("userEmail")}							
					/>
				</View>
				<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userEmail && touched.userEmail ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userEmail}</Text>}
				</View>
		
				<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="lock" size={20} color={errors.userPassword && touched.userPassword ? Colors.primary : Colors.grey1} />
					<TextInput
						placeholder="Inserisci Password"
						secureTextEntry={true}
						value={values.userPassword}
						style={{borderRadius: 25, width:180}}
						onChangeText={text => setFieldValue("userPassword", text.trim())}
						onBlur={() => setFieldTouched("userPassword") }
					/>
				</View>
				<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userPassword && touched.userPassword ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userPassword}</Text>}
				</View>

				<View style={{ height: 40 }}>
					<Text>{}</Text>
				</View>

				<View style={{justifyContent:'flex-end', alignItems:'center'}}>
					<TouchableOpacity style={styles.button} onPress={() => navigate('Reset')} >
						<Text style={{color: 'white', fontWeight:'bold'}}>Password dimenticata?</Text>				
					</TouchableOpacity>
				</View>

							 
				
		    </View>
			
			
		</TouchableWithoutFeedback>
		)}

		</Formik>

		

	</ImageBackground>
   );
  }
}

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover', // or 'stretch'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',		
	},
	pageName:{
		marginBottom: 40,
		color: Colors.primary,
		fontFamily: 'Wildemount Rough',
		fontSize: 80,		
	},
	inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 40,
		width:250,
		margin:1,
		borderRadius: 25, 
		backgroundColor: 'rgba(255,255,255,0.4)',
	},
	button:{
		backgroundColor: Colors.primary,
		borderRadius: 25, 		
		// width: '65%', 
		margin: 20, 
		padding: 10,
		alignItems:'center'
	},
	searchIcon: {
		padding: 10,
		margin: 0,
	},	

});

AppRegistry.registerComponent('login', () => login);
