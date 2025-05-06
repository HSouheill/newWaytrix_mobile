import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import ipAddress from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';
import Change_password from './Change_password';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type ResetPassRouteProp = RouteProp<{ params: { email: string; token: string } }, 'params'>;

// Updated navigation stack type if needed
type RootStackParamList = {
  Change_password: { email: string; resetToken: string };
  ResetPass: { email: string; token: string };
};

type ResetPassNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPass'>;

const ResetPass = () => {
  const [otpValue, setOtpValue] = useState('');
  const navigation = useNavigation<ResetPassNavigationProp>(); // Use the typed navigation
  const route = useRoute<ResetPassRouteProp>(); // Use the typed route
  const userEmail = route.params?.email || ''; // Safely access 'email'
  const token = route.params?.token || ''; // Safely access 'token'

  const verifyOTP = async () => {
    if (!otpValue.trim()) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (otpValue.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    try {
      const response = await axios.post(`${ipAddress}/api/auth/verifyOTP`, {
        email: userEmail,
        otp: otpValue,
        token, // Use the safely accessed token
      });

      // If verification successful, navigate to change password
      navigation.navigate('Change_password', {
        email: userEmail,
        resetToken: response.data.resetToken,
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to verify OTP');
    }
  };


  

  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundContainer}>

      <View style={styles.container}>
        <Image source={require('../../../assets/newlogo_waytrix.png')} style={styles.image}/>
        <Text style={styles.title}>Reset Password</Text>
        <Image source={require('../../../assets/forgot-password 1.png')} style={styles.image1}/>
        <Text style={styles.description}>
          An email was been sent to {userEmail} with an OTP for resetting your password.
        </Text>
        <Text style={styles.description}>
          This email may take a few minutes to arrive in your inbox
        </Text>
        <View style={styles.formcontainer}>
          <Text style={styles.label}>OTP</Text>

          <TextInput
            placeholder="Write here"
            value={otpValue}
            onChangeText={setOtpValue}
            style={styles.input}
            placeholderTextColor="#CCCCCC"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={verifyOTP}>
          <LinearGradient
            colors={['#3F63CB', '#679BFF']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-3%',
    // paddingHorizontal: 20,
    // backgroundColor: 'black',
  },

  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-10%',
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



export default ResetPass;
