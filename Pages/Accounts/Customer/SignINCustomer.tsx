import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    const userData = {
      email,
      password,
      role: "customer"
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id } = response.data;
      await AsyncStorage.setItem('customerToken', token);
      await AsyncStorage.setItem('customerId', _id);
      console.log('Token stored successfully:', token);

      // Start the logout timer
      setTimeout(async () => {
        await logoutUser();
      }, 120000); // 2 minutes in milliseconds

    } catch (error) {
      console.error('Error signing in:', error);
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
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#fff"
      />
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default SignIn;
