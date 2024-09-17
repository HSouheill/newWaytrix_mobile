import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ipAddress from '../../../config';
const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [showNewInputs, setShowNewInputs] = useState(false);
  const [forgotKey, setForgotKey] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        alert('Please enter a valid email');
        return;
      }
      
     
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/generateForgotKey`, {
        email: email
      });
      console.log('Email:', email);
      setShowEmailInput(false);
      setShowNewInputs(true);
    } catch (error) {
      console.error('Error submitting email:', error);
    }
  };
  const navigation = useNavigation();

  const handleNewInputsSubmit = async () => {
    if (password.trim().length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/updatePassword`, {
        email: email,
        forgotKey: Number(forgotKey),
        password: password
      });
      navigation.navigate('BonusScreen')
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Forgot Key:', forgotKey);
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <View style={styles.container}>
      {showEmailInput && (
        <>
          <Text style={styles.title}>Enter your email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
            placeholderTextColor="white"
          />
          <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}

      {showNewInputs && (
        <>
          <Text style={styles.title}>Enter your new password:</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            placeholderTextColor="white"
          />
          <Text style={styles.title}>Check your email for the key:</Text>
          <TextInput
            style={styles.input}
            placeholder="Forgot Key"
            onChangeText={(text) => setForgotKey(text)}
            value={forgotKey}
            placeholderTextColor="white"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleNewInputsSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ForgotPass;
