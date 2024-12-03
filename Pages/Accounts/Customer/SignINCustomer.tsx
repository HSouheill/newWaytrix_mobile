import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
  
    const userData = {
      email,
      password,
      role: "customer",
    };
  
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id } = response.data;
  
      // Store the customer token and ID
      await AsyncStorage.setItem('customerToken', token);
      await AsyncStorage.setItem('customerId', _id);
      console.log('Token stored successfully:', token);
  
      // Call the API to increment totalTimesSigned
      await incrementTotalTimesSigned(_id);
  
      // Start the logout timer (2 minutes)
      setTimeout(async () => {
        await logoutUser();
      }, 200000);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Login failed. Please check your Email and Password.');
    }
  };  
  
  // Function to increment totalTimesSigned
  const incrementTotalTimesSigned = async (userId) => {
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/incrementTotalTimesSigned`, { userId });
      console.log('Total times signed incremented:', response.data);
    } catch (error) {
      console.error('Error incrementing totalTimesSigned:', error);
    }
  };
  

  const logoutUser = async () => {
    await AsyncStorage.removeItem('customerToken');
    await AsyncStorage.removeItem('customerId');
    console.log('User logged out due to inactivity.');
    //navigation.navigate('SignIn'); // Navigate to the sign-in screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Customer Sign In</Text>
      <TextInput
        placeholder="Email Or Phone"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#fff"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput} // Modified style
          placeholderTextColor="#fff"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    paddingRight: 10, // Padding added to keep input and icon spaced
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
    //fontSize: 16,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    color: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff',

   
  },
  buttonText: {
    color: '#157f44',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default SignIn;
