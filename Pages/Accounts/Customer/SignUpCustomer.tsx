import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import SignIn from './SignINCustomer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker

const Customer = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('US'); // State to store the selected country code
  const [callingCode, setCallingCode] = useState('1'); // Default calling code for US
  
  // Country picker visibility state
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

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
    if (!name.trim() || !lastName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }
    if (!phone.trim() || isNaN(parseInt(phone.trim())) || phone.trim().length < 8) {
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

    // Combine the country code and phone number before sending
    const combinedPhone = `+${callingCode}${phone}`;

    const userData = {
      name,
      lastName,
      email,
      phone: combinedPhone, // Send combined phone number
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

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2); // Update country code
    setCallingCode(country.callingCode[0]); // Set the country calling code
    setIsCountryPickerVisible(false); // Hide country picker after selection
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
            placeholder="First Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#fff"
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
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
          
          {/* Phone number with country code dropdown */}
          <View style={styles.phoneContainer}>
            <TouchableOpacity onPress={() => setIsCountryPickerVisible(true)} style={styles.countryCodeButton}>
              <Text style={styles.countryCodeText}>+{callingCode}</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, { width: '84%' }]} // Inline style to adjust width
              placeholderTextColor="#fff"
            />

          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              placeholderTextColor="#fff"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationModalVisible}
        onRequestClose={() => setVerificationModalVisible(false)}
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

      {/* Country Picker Modal */}
      <CountryPicker
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={onSelectCountry}
        withFlag
      />
    </View>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#333',
    width: '15%',  // Adjust width to take up less space
    marginVertical: 5,
    marginRight: 5,
  },
  countryFlag: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  countryCodeText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    marginLeft: 10,  // Space between country code and phone input
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
  button: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#157f44',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
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

  headerText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
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
    backgroundColor: '#000',
  },
  selectedGender: {
    backgroundColor: '#000',
    borderColor: '#157f44',
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
