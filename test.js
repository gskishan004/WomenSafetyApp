import React, { Component, PropTypes } from 'react'
import { Platform, Alert, StyleSheet, Text, View, AsyncStorage,TextInput, Animated,KeyboardAvoidingView, Keyboard} from 'react-native'
import CustomTextInput from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import metrics from '../../config/metrics'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const IS_ANDROID = Platform.OS === 'android'

/**
 * Just a centered logout button.
 */
export default class HomeScreen extends Component {
  
  static propTypes = {
    logout: PropTypes.func
  }
  constructor(props) {
    super(props);
    AsyncStorage.getItem('user')
      .then((item) => {
        if (item) {
          this.setState({ psid: item });
        }
        else {
          Alert.alert(
            'We could not find your credentials in the session'
          )
        }
    });
  }
  state={
    psid:'',
    name:'Ishan',
    baseAddress:'BusinessBay',
    reason:'',
    managerName:'Padmashri',
    managerContact:'123456789',
    travelTo:'',
    travelBy:''
  }
  
  notify = () => {
    console.log("Notify manager!");
    
	let formdata = new FormData();
    formdata.append("psid", username);
	formdata.append("reason", reason);
	formdata.append("date", date);
	formdata.append("travellingTo", travellingTo);
	formdata.append("travellingBy", travellingBy);

    fetch("https://cmb-women-safety-api.herokuapp.com/latestay", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formdata
    })
      .then(response => {
        
        if (response._bodyText === "true")
        {
		  const json =  response.json();
		  
          AsyncStorage.setItem('user', username);
          this.setState({ isLoggedIn: true, isLoading: false, loggedUser: username });
        }
        else if (response._bodyText === "false")
        {
          this.setState({ isLoggedIn: false, isLoading:false }) 
          Alert.alert(
          'Invalid credentials'
          )         
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoggedIn: false })
      });
	  
	
	Alert.alert(
      'Your manager has been notified'
    )  
    this.setState({ reason:'', travelTo:'', travelBy:'' });
  }
  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
        <Text style={{ fontSize: 15, marginBottom:15, marginTop:30}}>
        Employee details
      </Text>
        <TextInput
          style={styles.psidInput}
          ref={(ref) => this.psidRef = ref}
          editable={false}
          returnKeyType={'next'}
          value={this.state.psid}
          withRef={true}
          isEnabled={false}
        />
       
        <TextInput
          style={styles.psidInput}
          ref={(ref) => this.empNameRef = ref}
          editable={false}
          returnKeyType={'next'}
          value={this.state.name}
          withRef={true}
          isEnabled={false}
        />
     
        <TextInput
          style={styles.psidInput}
          ref={(ref) => this.baseAddressRef = ref}
          editable={false}
          returnKeyType={'next'}
          value={this.state.baseAddress}
          withRef={true}
          isEnabled={false}
        />  
        <Text style={{ fontSize: 15, marginBottom: 15, marginTop: 15 }}>
          Manager details
      </Text>
        <TextInput
          style={styles.psidInput}
          ref={(ref) => this.mngrNameRef = ref}
          editable={false}
          returnKeyType={'next'}
          value={this.state.managerName}
          withRef={true}
          isEnabled={false}
        />  
        <TextInput
          style={styles.psidInput}
          ref={(ref) => this.mngrContactRef = ref}
          editable={false}
          returnKeyType={'next'}
          value={this.state.managerContact}
          withRef={true}
          isEnabled={false}
        />  
        
         <TextInput
          ref={(ref) => this.reasonRef = ref}
          autoCorrect={true}
          placeholder={'Reason for late stay'}
          onChangeText={(value) => this.setState({ reason: value })}
          onSubmitEditing={() => this.travelToRef.focus()}
          style={[styles.reasonInput]}
          isEnabled={true}
          selectionColor={'gray'}
          returnKeyType={'next'}
          value={this.state.reason}
        />  
         
         <TextInput
           ref={(ref) => this.travelToRef = ref}
           autoCorrect={true}
           placeholder={'Traveling to'}
           onSubmitEditing={() => this.travelByRef.focus()}
           onChangeText={(value) => this.setState({ travelTo: value })}
           style={[styles.reasonInput]}
           isEnabled={true}
           selectionColor={'gray'}
           returnKeyType={'next'}
           value={this.state.travelTo}
         />  
         <TextInput
           ref={(ref) => this.travelByRef = ref}
           style={styles.psidInput}
           onChangeText={(value) => this.setState({ travelBy: value })}
           editable={true}
           placeholder={'Traveling by'}
           returnKeyType={'done'}
           value={this.state.travelBy}
           withRef={true}
           isEnabled={true}
         /> 
         <CustomButton
           text={'Notify'}
           onPress={this.notify}
           isEnabled= { this.state.reason!=='' && this.state.travelTo!='' && this.state.travelBy!='' } 
           buttonStyle={styles.button}
           textStyle={styles.buttonText}
         />
        {/* <CustomButton
          text={'Logout'}
          onPress={this.props.logout}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        /> */}
        </View>
      </KeyboardAwareScrollView>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  psidInput: {
    height: 42,
    margin: IS_ANDROID ? -1 : 0,
    padding: 7,
    borderColor: 'gray',
    borderWidth: 1
  },
  reasonInput: {
    height:50,
    borderColor: 'gray',
    borderWidth:1,
    marginTop: 15, margin: IS_ANDROID ? -1 : 0,
    padding: 7
  },
  
  button: {
    backgroundColor: '#1976D2',
    margin: 15,
    padding:10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }, 
})
