import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Luxurious icon
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ipAddress from '../../../config';



const TableLogout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });

    const timer = setTimeout(() => {
      navigation.setOptions({
        headerShown: true,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.setOptions({
        headerShown: false,
      });

      setTimeout(() => {
        navigation.navigate('Home');
      }, 3000);
    }
  }, [isAuthenticated, navigation]);

  const handleSignIn = async () => {
    // if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    //   alert('Please enter a valid email');
    //   return;
    // }
    
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    const userData = {
      email,
      password,
      role: "table",
      deleteCheck:true
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      await AsyncStorage.removeItem('tableToken');
      
      setIsAuthenticated(true);
      navigation.setOptions({
        headerShown: false,
      });
      
      setTimeout(() => {
        navigation.navigate('Home');
      }, 1500);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeIcon}>
        <AntDesign name="home" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Table Logout</Text>
      <TextInput
        placeholder="Table Num"
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
        <Text style={styles.buttonText}>Logout</Text>
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
  homeIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
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
    backgroundColor: 'transparent',
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

export default TableLogout;
