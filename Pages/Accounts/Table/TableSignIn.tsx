import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import ipAddress from '../../../config';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [ip, setIp] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({
        headerShown: false,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getLocationAndIp = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLongitude(location.coords.longitude);
      setLatitude(location.coords.latitude);

      let ipAddress = await Network.getIpAddressAsync();
      setIp(ipAddress);
    };

    getLocationAndIp();
  }, []);

  const handleSignIn = async () => {
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    const userData = {
      email,
      password,
      role: "table",
      longitude,
      latitude,
      ip
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id } = response.data;
      await AsyncStorage.setItem('tableToken', token);
      await AsyncStorage.setItem('tableId', _id);
      console.log('Token stored successfully:', token);
      navigation.setOptions({
        headerShown: true,
      });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('valetlogin')} style={styles.iconButton}>
        <Icon name="login" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Table Sign In</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Table Num"
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
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#fff" />
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
  showPasswordButton: {
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
