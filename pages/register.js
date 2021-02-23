import React, { Component, Fragment } from 'react';
import {
  AppRegistry, CheckBox, Linking, StyleSheet,
  Text, StatusBar, Keyboard,TouchableWithoutFeedback,
  View,TextInput,TouchableOpacity, ScrollView, SafeAreaView,
  ImageBackground
} from 'react-native';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from 'react-native-animatable';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';
import { colors } from 'react-native-elements';

const myvalidationSchema = Yup.object().shape({
	userName: Yup
		.string()
		.required("↑ Inserisci il Tuo Nome!")
		.min(2,"↑ Nome non valido")
		.max(30,"↑ Nome troppo Lungo")
		.matches(/^[aA-zZ]+$/, "↑ Solo lettere senza spazi"),
	userEmail: Yup
		.string()
		.required("↑ Inserisci la tua email!")
	  	.email('↑ Email non corretta'),
	userPassword: Yup
		.string()
		.required("↑ Inserisci la Password!")
		.matches(/^[aA-zZ0-9]+$/, "↑ Solo lettere e numeri senza spazi")
		.min(8,"↑ Password deve essere almeno 8 caratteri"),
	confirmPassword: Yup
		.string()
		.required("↑ Ripeti la Password")
		.oneOf([Yup.ref("userPassword")], "Le 2 Password devono coincidere"),
	checkBox1: Yup
		.bool()
		.oneOf([true]),
});

export default class register extends Component {
	
constructor(props){
	super(props)
	this.state={
		userName:'',
		userEmail:'', 
		userPassword:'',		
		userToken:'',
		checkBox1: false,
		checkBox2: false
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
				alert('Nessun permesso fornito per ricevere Notifiche');
			}
		}

		const fcmToken = await firebase.messaging().getToken()
		if (fcmToken) {
			this.setState({userToken: fcmToken})
		}

		this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
			if (fcmToken) {this.setState({userToken: fcmToken})}
		})
			
	}

	userRegister = (values) =>{				
		const {userName,userEmail,userPassword, checkBox2} = values;
		const userToken = this.state.userToken;
		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
		const myuuid = uuidv4();
		const today = moment(new Date(), "DD-MM-YYYY").format("YYYY-MM-DD");
		const consens = (checkBox2)? 1 : 0;		
				
		fetch(`${IP}/register.php`, {
			method: 'POST',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				uuid: myuuid,
				name: userName,
				email: upperEmail,
				password: md5Password,
				regdate: today,							
				consens: consens
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson==='OK'){

				fetch(`${IP}/RegisterDevice.php`, {
					method: 'POST',
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify({
						uuid: myuuid,
						token: userToken,
						email: upperEmail,
					})
				})
				.then((response) => response.json())
				.then((responseData) => {alert(responseData)})
				.catch((err) => {alert(err)});

			}
			else {alert(responseJson)}
		})
		.catch((error) => {alert(error)});

		this.props.navigation.navigate("Home");
				
	}

	render() {
			
		return (

			<ImageBackground 
				source={require('../components/images/chef.jpg')}
				style={styles.backgroundImage}
			>
			
			<View style={{justifyContent: 'flex-start',	alignItems: 'flex-start', marginBottom: 15}}>
				<TouchableOpacity
					onPress={() => {this.props.navigation.navigate("Home")}}>
					<Icon style={{ padding: 10 }} name="arrow-left" padding={15} size={25} color={Colors.primary} />
				</TouchableOpacity>
			</View>

			<Formik
				initialValues={{userName:'',userEmail:'',userPassword:'',confirmPassword:'',checkBox1: false, checkBox2: false}}
				// onSubmit={values => alert(JSON.stringify(values))}
				onSubmit={values => this.userRegister(values)}
				validationSchema={myvalidationSchema}
			>
			
			{({ values, errors, setFieldValue, touched, setFieldTouched, isValid, handleSubmit }) => (

			
			
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>			
			<View style={styles.container}>
					<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />					
					
					
					<ScrollView contentContainerStyle={styles.contentContainer} >
					<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="user" size={20} color={errors.userName && touched.userName ? Colors.primary : 'transparent'}  />			
					<TextInput
						placeholder="Inserisci il Tuo Nome"
						style={{borderRadius: 25, width:220}}	
						underlineColorAndroid="transparent"
						value={values.userName}
						onChangeText={text => setFieldValue("userName", text.trim())}
						onBlur={() => setFieldTouched("userName")}													
					/>
					</View>

					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userName && touched.userName ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userName}</Text>}
					</View>
					

					<View style={styles.inputForm}>
					<Icon style={styles.searchIcon} name="envelope" size={20} color={errors.userEmail && touched.userEmail ? Colors.primary : 'transparent'}  />		
					<TextInput
						placeholder="Inserisci la tua Email"
						style={{borderRadius: 25, width:220}}
						onChangeText={text => setFieldValue("userEmail", text.trim())}
						onBlur={() => setFieldTouched("userEmail")}
					/>
					</View>
		
					
					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userEmail && touched.userEmail ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userEmail}</Text>}
					</View>
					
					<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="lock" size={20} color={errors.userPassword && touched.userPassword ? Colors.primary : 'transparent'} />
					<TextInput
						placeholder="Inserisci la Password"
						secureTextEntry={true}
						style={{borderRadius: 25, width:220}}
						onChangeText={text => setFieldValue("userPassword", text.trim())}
						onBlur={() => setFieldTouched("userPassword") }
					/>
					</View>

					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userPassword && touched.userPassword ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userPassword}</Text>}
					</View>

					<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="lock" size={20} color={errors.confirmPassword && touched.confirmPassword ? Colors.primary : 'transparent'} />
					<TextInput
						placeholder="Conferma la Password"
						secureTextEntry={true}
						style={{borderRadius: 25, width:220}}
						onChangeText={text => setFieldValue("confirmPassword", text.trim())}
						onBlur={() => setFieldTouched("confirmPassword") }
					/>
					</View>

					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.confirmPassword && touched.confirmPassword ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.confirmPassword}</Text>}
					</View>

					<View style={styles.terms}>	
						<View style={styles.insideTerms}>					
							<CheckBox
								disabled={false}
								value={values.checkBox1}
								onValueChange={(newValue) => setFieldValue("checkBox1",newValue)}
								// style={{backgroundColor: Colors.primary}}
							/>
							{/* https://stackoverflow.com/questions/36284453 */}
							<View style={{marginLeft: 10, flexShrink: 1}}>
								<Text style={{flexShrink: 1}}>
									<Text>{'Dichiaro di aver letto i '}</Text>
									<Text 
										style={{flexShrink: 1, fontWeight: "bold"}}
										onPress={() => {this.props.navigation.navigate("Terms")}}
										// onPress={() => Linking.openURL('https://www.jobby.works/privacy-policy')}
									>
										{'Termini e Condizioni ExtraStaff'}
									</Text>
									<Text>{' e l\''}</Text>
									<Text 
										style={{flexShrink: 1, fontWeight: "bold"}}
										onPress={() => {this.props.navigation.navigate("Privacy")}}
									>
										{'Informativa Privacy'}</Text>
									<Text>{' ad essi allegata e di accettarne le condizioni.'}</Text>
								</Text>
								<Text style={{color: (errors.checkBox1)? Colors.primary:'black', fontWeight: "bold"}}>{'OBBLIGATORIO'}</Text>
							</View>
						</View>
						<View style={styles.insideTerms}>					
							<CheckBox
								disabled={false}
								value={values.checkBox2}
								onValueChange={(newValue) => setFieldValue("checkBox2",newValue)}								
							/>						
							<View style={{marginLeft: 10, flexShrink: 1}}>
								<Text style={{flexShrink: 1}}>
									{'Dichiaro di acconsentire al trattamento per finalità di marketing e a ricevere comunicazioni commerciali mirate.'}
								</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity onPress={handleSubmit}>
						{ isValid ? 
						(<Animatable.Text animation="rubberBand" iterationCount="infinite" easing="ease-out" style={styles.pageName}>
								{'→Registrati←'}
						</Animatable.Text>):
						<Text style={styles.pageName}>{'Registrati'}</Text>}
					</TouchableOpacity>

					</ScrollView>
					
			</View>
			</TouchableWithoutFeedback>
			

			
			

			)}

			</Formik>

			<View style={{ height: 20 }}><Text>{}</Text></View>
							
			</ImageBackground>
	
		);
	}

}

const styles = StyleSheet.create({

	container: {		
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#F5FCFF',
	},

	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		resizeMode: 'cover', // or 'stretch'
	},
	contentContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},

	inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		//backgroundColor: 'transparent',
		width:280,
		height: 40,
		margin: 1,
		borderRadius: 25, 
		//borderWidth:1,
		//borderColor: 'gray',
		backgroundColor: 'rgba(255,255,255,0.4)',
	},
	
	pageName:{
		marginTop: 20,
		marginBottom: 30,
		justifyContent: 'flex-start',
		alignItems: 'center',
		color: Colors.primary,
		fontFamily: 'Wildemount Rough',
		fontSize: 55,		
	},

	terms:{
		width: '90%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: 'rgba(255,255,255,0.4)',
		borderRadius: 15, 
	},

	insideTerms:{
		padding: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		
	},

	searchIcon: {
		padding: 10,
		// margin: 10,
	},	

  
});

AppRegistry.registerComponent('register', () => register);
