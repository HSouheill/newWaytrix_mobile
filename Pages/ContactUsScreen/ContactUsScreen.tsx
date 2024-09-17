import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Partners from './Partner';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ipAddress from '../../config';

const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [tableId, setTableId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
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

    fetchTableId();
  }, [isFocused]);

  const handlePageClick = async () => {
    const tableToken = await AsyncStorage.getItem('tableToken');
    const restoId = await AsyncStorage.getItem('restoId');

    const requestData = {
      restoId: restoId,
      ContactUsClick: 1,
    };

    const headers = {
      Authorization: `${tableToken}`,
    };

    try {
      const response = await axios.post(`${ipAddress}/api/DashBoardRoutes/add_contact_us_click`, requestData, { headers });
      console.log('Contact us page clicked:', response.data);
    } catch (error) {
      console.error('Error clicking contact us page:', error);
    }
  };

  const handleSubmit = async () => {
    const tableToken = await AsyncStorage.getItem('tableToken');
  
    const requestData = {
      Name: name,
      Phone: phone,
      Text: text,
      tableId: tableId,
    };
  
    const headers = {
      Authorization: `${tableToken}`
    };
  
    try {
      const response = await axios.post(`${ipAddress}/api/ContactUsRoutes/ContactUs`, requestData, { headers });
      console.log('Form submitted successfully:', response.data);
  
      // Clear form fields
      setName('');
      setPhone('');
      setText('');
  
      // Show modal
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setTimeout(() => {
          navigation.navigate("Home")
        }, 1500);

      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} >
      <TouchableWithoutFeedback onPress={handlePageClick}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Text</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          placeholder="Enter your message"
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
        <Partners />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Thanks for your request</Text>
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: '#000',
    borderWidth: 3,
    color: '#000',
    fontWeight: 'bold',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactUsScreen;
