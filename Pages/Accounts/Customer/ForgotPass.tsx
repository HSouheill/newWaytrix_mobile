import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import { useNavigation} from '@react-navigation/native';
import ipAddress from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';
import Change_password from './Change_password';
import ResetPass from './ResetPass';
import { StackNavigationProp } from '@react-navigation/stack';



type RootStackParamList = {
  ForgotPass: undefined;
  ResetPass: { 
    email: string; 
    token?: string  // Make token optional
  };
  Change_password: { 
    email: string; 
    resetToken: string 
  };
};

// When navigating


type ForgotPassNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPass'>;

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [showNewInputs, setShowNewInputs] = useState(false);
  const [forgotKey, setForgotKey] = useState('');
  const [password, setPassword] = useState('');
  
  // const navigation = useNavigation();
  const navigation = useNavigation<ForgotPassNavigationProp>();
  
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    try {
      const otpResponse = await axios.post(`${ipAddress}/api/auth/forgotpassword`, { 
        email 
      });
      
      navigation.navigate('ResetPass', { 
        email: email 
      });
    } catch (error) { 
      console.error('Full error:', error);
      alert(
        error.response?.data?.message || 
        `Failed to send OTP. ${error.message}`
      );
    }
  };

  return (
        <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundContainer}>
    <View style={styles.container}>
      <Image source={require('../../../assets/newlogo_waytrix.png')} style={styles.image}/>
      <View style={styles.content}>
      <Text style={styles.title}>Reset Password</Text>
      <Image source={require('../../../assets/forgot-password 2.png')} style={styles.image1}/>
      <Text style={styles.description}>Enter the email address associated with your account.</Text>
      <View style={styles.formcontainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
                  placeholder="Write here"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#CCCCCC"
                  />
      </View>

       <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#3F63CB', '#679BFF']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </LinearGradient>
              </TouchableOpacity>
    </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-8%',
    // paddingHorizontal: 20,
    // backgroundColor: 'black',
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-10%',
  },
  content:{
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    top: '5%',
 
  },
  image: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  image1: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
    // top: '-10%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
    width: 559,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
    width: 400,
    textAlign: 'center',
    marginTop: 10,
  },
  formcontainer: {
    width:  380,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    // color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: '#FFFFFF',  // Set background color to white
    color: '#000000',   
  },
  buttonContainer: {
    width: 150,
    height: 40,
    borderRadius: 99,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginTop: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99, // Ensure that the gradient follows this border radius
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ForgotPass;
