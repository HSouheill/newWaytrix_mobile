import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ipAddress from '../../../config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({
        headerShown: false,
      });
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignIn = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email');
      return;
    }

    if (password.trim().length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters');
      return;
    }

    const userData = {
      email,
      password,
      role: "valet"
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id } = response.data;

      await AsyncStorage.setItem('valetToken', token);
      await AsyncStorage.setItem('valetId', _id);
      console.log('Token stored successfully:', token);

      navigation.setOptions({
        headerShown: false,
      });

      // Navigate to the next screen if necessary
      // navigation.navigate('ValetAccountScreen');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign In Failed', 'Unable to sign in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconButton}>
        <Icon name="login" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Valet Sign In</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeButton}
        >
          <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'transparent',
    minHeight: 40,  // Added minHeight for better visibility
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'transparent',
    minHeight: 40,  // Ensure this matches the inputContainer minHeight
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
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
  iconButton: {
    marginBottom: 20,
    padding: 10,
  },
});

export default SignIn;
