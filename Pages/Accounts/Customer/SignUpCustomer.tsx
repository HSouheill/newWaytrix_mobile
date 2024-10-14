import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import SignIn from './SignINCustomer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';

const Customer = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(''); 
  const [age, setAge] = useState(''); 
  const [isSignIn, setIsSignIn] = useState(true);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      AsyncStorage.getItem('verificationModalVisible').then(value => {
        if (value !== null) {
          setVerificationModalVisible(JSON.parse(value));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('verificationModalVisible', JSON.stringify(verificationModalVisible));
  }, [verificationModalVisible]);

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }
    if (!phone.trim() || isNaN(parseInt(phone.trim())) || phone.trim().length < 9) {
      alert('Please enter a valid phone number with at least 9 digits');
      return;
    }
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (!gender) {
      alert('Please select a gender');
      return;
    }
    if (!age.trim() || isNaN(parseInt(age.trim()))) {
      alert('Please enter a valid age');
      return;
    }

    const userData = {
      name,
      email,
      phone: parseInt(phone),
      password,
      gender, 
      age: parseInt(age),
      role: 'customer',
    };

    axios.post(`${ipAddress}/api/Auth/signup`, userData)
      .then(response => {
        console.log(response.data);
        AsyncStorage.setItem('customerId', response.data._id);
        AsyncStorage.setItem('verificationModalVisible', JSON.stringify(true));
      })
      .catch(error => {
        console.error(error);
        alert('Signup failed: ' + error.response.data);
      });
  };

  const handleVerify = () => {
    const verificationData = {
      email,
      verificationKey: parseInt(verificationKey),
    };

    axios.post(`${ipAddress}/api/Auth/verifyUser`, verificationData)
      .then(response => {
        console.log(response.data);
        setVerificationModalVisible(false);
        alert('User verified successfully!');
      })
      .catch(error => {
        alert('Verification failed: ' + error.response.data);
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={handleToggleMode}>
          <Text style={styles.toggleText}>{isSignIn ? 'Switch To Sign Up' : 'Switch To Sign In'}</Text>
        </TouchableOpacity>
      </View>
      {isSignIn ? (
        <SignIn />
      ) : (
        <>
          <Text style={styles.headerText}>Customer Sign Up</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#fff"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#fff"
          />
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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
          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#fff"
          />
          <Text style={styles.label}>Gender:</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
      {isSignIn &&
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={styles.toggleText}>Forgot Your Password?!</Text>
        </TouchableOpacity>
      </View>}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationModalVisible}
        onRequestClose={() => {
          setVerificationModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headerText}>Check Your Email</Text>
            <TextInput
              placeholder="Email Verification Key"
              value={verificationKey}
              onChangeText={setVerificationKey}
              style={styles.input}
              placeholderTextColor="#fff"
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleVerify} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVerificationModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
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
  label: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  selectedGender: {
    backgroundColor: '#555',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleContainer: {
    marginTop: 14,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
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
    fontStyle: 'italic'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    borderWidth:3,
    borderColor:'white',
    margin: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Customer;
