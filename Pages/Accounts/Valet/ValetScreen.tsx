import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import AddCars from './valet/AddCar';
import GetCars from './valet/GetCars';

const ValetScreen = () => {
  const [valetToken, setValetToken] = useState(null);
  const [valetId, setValetId] = useState(null);
  const [activeComponent, setActiveComponent] = useState('getCars');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
        console.log("huuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  
  useEffect(() => {
    const fetchValetData = async () => {
      navigation.setOptions({
        headerShown: false,
      });

      // Fetch data or perform actions here

    };

    // Activate useEffect on initial visit and every 2 seconds
    fetchValetData();
    const interval = setInterval(fetchValetData, 2000);

    return () => clearInterval(interval);
  }, []);

  const switchToGetCars = () => {
    setActiveComponent('getCars');
  };

  const switchToAddCars = () => {
    setActiveComponent('addCars');
  };

  const handleLogout = async () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('valetToken');
      setValetToken(null);
      setLogoutModalVisible(false);
      // Navigate to login or another screen after logout
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const renderComponent = () => {
    if (activeComponent === 'getCars') {
      return <GetCars />;
    } else if (activeComponent === 'addCars') {
      return <AddCars />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, activeComponent === 'getCars' && styles.activeButton]}
          onPress={switchToGetCars}
        >
          <Text style={[styles.buttonText, activeComponent === 'getCars' && styles.activeButtonText]}>Get Cars</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.button, activeComponent === 'addCars' && styles.activeButton]}
          onPress={switchToAddCars}
        >
          <Text style={[styles.buttonText, activeComponent === 'addCars' && styles.activeButtonText]}>Add Cars</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ key: 'component' }]}
        renderItem={() => renderComponent()}
        keyExtractor={(item) => item.key}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
   

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 45, // FOR FOOTER
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: 'black',
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight:'bold',
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: '#aaa',
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    borderColor: '#007BFF',
    backgroundColor: 'black',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ValetScreen;
