import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert, Platform, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Partners from './Partner';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ipAddress from '../../config';
import { LinearGradient } from 'expo-linear-gradient';

const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [tableId, setTableId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchTableId();
    handlePageClick();
  }, [isFocused]);

  const fetchTableId = async () => {
    try {
      const value = await AsyncStorage.getItem('tableId');
      if (value !== null) {
        setTableId(value);
      }
    } catch (error) {
      console.error('Error fetching tableId from AsyncStorage', error);
    }
  };

  const handlePageClick = async () => {
    try {
      const tableToken = await AsyncStorage.getItem('tableToken');
      const restoId = await AsyncStorage.getItem('restoId');

      const requestData = {
        restoId: restoId,
        ContactUsClick: 1,
      };

      const headers = {
        Authorization: `${tableToken}`,
      };

      const response = await axios.post(`${ipAddress}/api/DashBoardRoutes/add_contact_us_click`, requestData, { headers });
      console.log('Contact us page clicked:', response.data);
    } catch (error) {
      console.error('Error clicking contact us page:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || !email || !text) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      const tableToken = await AsyncStorage.getItem('tableToken');
      
      const requestData = {
        Name: name,
        Phone: phone,
        email: email,
        Text: text,
        tableId: tableId,
      };
    
      const headers = {
        Authorization: `${tableToken}`
      };
    
      const response = await axios.post(`${ipAddress}/api/ContactUsRoutes/ContactUs`, requestData, { headers });
      console.log('Form submitted successfully:', response.data);
    
      setName('');
      setEmail('');
      setPhone('');
      setText('');
    
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 4000);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Submission Error', 'Unable to submit form. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#3F63CB', '#003266', '#000000']}
      style={styles.container}
    >
      {/* Main ScrollView wrapper */}
      <ScrollView
        bounces={false}
        style={styles.scrollViewMain}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
      >
     <TouchableWithoutFeedback>
        
        <View style={styles.innerContainer}>
          <Image 
            source={require('../../assets/logo1.png')} 
            style={styles.logo} 
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Reach Us</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Write Here"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Write Here"
              placeholderTextColor="#ccc"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Write Here"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textInput]}
              placeholder="Write Here"
              placeholderTextColor="#ccc"
              value={text}
              onChangeText={setText}
              multiline
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
              <LinearGradient
                colors={['#3F63CB', '#679BFF']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.title, styles.partnersTitle]}>OUR PARTNERS</Text>
            <Partners />
          </View>
        </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <LinearGradient
            colors={['#000000', '#003266']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9789 }}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Your form has been received!</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        zIndex: 0,
      },
    }),
  },
  scrollViewMain: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  partnersTitle: {
    marginTop: 30,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    borderColor: '#fff',
    borderWidth: 0.5,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    opacity: 0.8,
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: 150,   
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 20,
    padding: 10,
    width: '100%',
    maxWidth: 400,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    borderRadius: 10,
    width: '90%',
  },
  modalText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactUsScreen;