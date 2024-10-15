import React, { useEffect, useState } from 'react';
import { View, Text,Dimensions, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetRestoId from './GetRestoId';
import ipAddress from '../../../../config';

const GetCars = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // deleteSet
  const [countdownSet, setCountdownSet] = useState(false); // State to track countdown set status
  const [deleteSet, setDeleteSet] = useState(false);
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const fetchData = async () => {
    try {
      const valetToken = await AsyncStorage.getItem('valetToken');
      const restoId = await AsyncStorage.getItem('restoId');
      
      const response = await axios.post(`${ipAddress}/api/ButtonsRoutes/GetRequestedCars`, {
        restoId: restoId
      }, {
        headers: {
          Authorization: valetToken
        }
      });
  
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    }
  };
  

  const handleDelete = async (_id) => {
    setDeleteId(_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('valetToken');
      const headers = { Authorization: token };
      await axios.post(`${ipAddress}/api/ButtonsRoutes/deleteCar`, {
        _id: deleteId
      }, { headers });
      setShowModal(false);
      setDeleteId(null);
      fetchData(); // Refresh data after deletion
      setDeleteSet(true)
      setTimeout(() => {
        setDeleteSet(false);
      }, 1500);
      // Alert.alert('Success', 'Car deleted successfully');
    } catch (error) {
      console.error('Error deleting car:', error);
      Alert.alert('Error', 'Failed to delete car');
    }
  };
  

  const logNumber = async (number, _id) => {
    try {
      // Fetch valetToken from AsyncStorage
      const valetToken = await AsyncStorage.getItem('valetToken');
  
      // Set Authorization header with valetToken
      const headers = {
        Authorization: valetToken
      };
  
      // Make POST request with headers
      const response = await axios.post(`${ipAddress}/api/ButtonsRoutes/set_count_down_valet`, {
        _id: _id,
        timeNum: number
      }, { headers });
  
      console.log(response.data); // Log response data
      setCountdownSet(true); // Set countdown set status to true
  
      // Implement modal or UI update as per your design
  
      setTimeout(() => {
        setCountdownSet(false);
      }, 2000);
    } catch (error) {
      console.error('Error setting countdown:', error);
      Alert.alert('Error', 'Failed to set countdown');
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <GetRestoId/>
      {cars.map((item) => (
        <View key={item._id} style={styles.card}>
          <Text style={styles.text}>Ticket Num: {item.ticketNum}</Text>
          <Text style={styles.text}>Car: {item.carName}</Text>
          <Text style={styles.text}>Color: {item.color}</Text>
          
          <View style={styles.buttonContainer}>
            {[3, 5, 8, 10, 15].map((number) => (
             <TouchableOpacity key={number} style={styles.numberButton} onPress={() => logNumber(number, item._id)}>
             <Text style={styles.numberButtonText}>{number}</Text>
           </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this car?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.modalCancelButton]} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalDeleteButton]} onPress={confirmDelete}>
                <Text style={[styles.modalButtonText, styles.modalDeleteButtonText]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Complex dark theme modal */}
      {countdownSet && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={countdownSet}
          onRequestClose={() => setCountdownSet(false)}
        >
          <View style={styles.darkThemeModalBackground}>
            <View style={styles.darkThemeModalContent}>
              <Text style={styles.darkThemeModalText}>Countdown time set successfully!</Text>
            </View>
          </View>
        </Modal>
      )}

{deleteSet && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteSet}
          onRequestClose={() => setDeleteSet(false)}
        >
          <View style={styles.darkThemeModalBackground}>
            <View style={styles.darkThemeModalContent}>
              <Text style={styles.darkThemeModalText}>Car Ticket deleted successfully!</Text>
            </View>
          </View>
        </Modal>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Darker than black
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1E1E1E', // Dark gray
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: Dimensions.get('window').width - 100,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333333', // Dark grayish
  },
  text: {
    color: '#FFFFFF', // White
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'white', // Red
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'black', // White
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom:10,
  },
  numberButton: {
    backgroundColor: '#FFFFFF', // White
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  numberButtonText: {
    color: '#000000', // Black
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    minWidth: 300,
    maxWidth: Dimensions.get('window').width - 50,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#666666',
  },
  modalDeleteButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDeleteButtonText: {
    color: '#FFFFFF',
  }, darkThemeModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkThemeModalContent: {
    borderWidth:2,
    borderColor:'white',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  darkThemeModalText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default GetCars;
