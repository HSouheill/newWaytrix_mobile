import React, { useState, useEffect } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GetRestoId from './GetRestoId';
import ipAddress from '../../../../config';

const AddCar = () => {
  const [ticketNum, setTicketNum] = useState('');
  const [valetId, setValetId] = useState('');
  const [restoId, setRestoId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [carTicketNumber, setCarTicketNumber] = useState('');
  const [copiedModalodalVisible, setCopiedModalodalVisible] = useState(false);

  useEffect(() => {
    const fetchValetId = async () => {
      try {
        const savedValetId = await AsyncStorage.getItem('valetId');
        const savedRestoId = await AsyncStorage.getItem('restoId');
        if (savedRestoId !== null) {
          setRestoId(savedRestoId);
        }
        if (savedValetId !== null) {
          setValetId(savedValetId);
        }
      } catch (error) {
        console.error('Error fetching valetId from AsyncStorage:', error);
      }
    };

    fetchValetId();
  }, []);

  const handleSubmit = async () => {
    try {
      // Retrieve valetToken from AsyncStorage
      const valetToken = await AsyncStorage.getItem('valetToken');
  
      // Make POST request with Authorization header
      const response = await axios.post(
        `${ipAddress}/api/ButtonsRoutes/AddCar`,
        {
          ticketNum,
          valetId,
          restoId
        },
        {
          headers: {
            Authorization: valetToken
          }
        }
      );
  
      if (response.data._id) {
        setTicketNum("");
        setCarTicketNumber(response.data._id);
        setModalVisible(true);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again later.');
    }
  };
  
// closeCopiedModal
const closeCopiedModal = () => {
  setCopiedModalodalVisible(false);
};
  const closeModal = () => {
    setTimeout(() => {
 setModalVisible(false);
}, 1000);

  };

  const copyToClipboard = () => {
    Clipboard.setString(carTicketNumber);
    setCopiedModalodalVisible(true);
    setTimeout(() => {
      setCopiedModalodalVisible(false);
    }, 1400);
    // Alert.alert('Copied to Clipboard', 'Car Ticket Number copied successfully!');
    setTimeout(() => {

    setModalVisible(false);
  }, 2000);

  };

  return (
    <View style={styles.container}>
      <GetRestoId />
      <Text style={styles.title}>Add Cars Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Ticket Number"
        onChangeText={text => setTicketNum(text)}
        value={ticketNum}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
{/* copiedModalodalVisible */}
<Modal
        animationType="slide"
        transparent={true}
        visible={copiedModalodalVisible}
        onRequestClose={closeCopiedModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Copied Successfully!</Text>
            
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Car Ticket Number:</Text>
            <Text style={styles.carTicketNumber}>{carTicketNumber}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy Car Ticket Number</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  carTicketNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});
export default AddCar;

