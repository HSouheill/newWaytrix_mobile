import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';

const ValetScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [selectedCarName, setSelectedCarName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [restoId, setRestoId] = useState('');
  const [carNameSearch, setCarNameSearch] = useState('');
  const [colorSearch, setColorSearch] = useState('');
  const [isCarDropdownVisible, setIsCarDropdownVisible] = useState(false);
  const [isColorDropdownVisible, setIsColorDropdownVisible] = useState(false);

  const carNames = [
    'Toyota','Camaro', 'Honda', 'Ford', 'BMW', 'Audi', 'Mercedes', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai',
    'Kia', 'Volkswagen', 'Subaru', 'Mazda', 'Lexus', 'Jaguar', 'Land Rover', 'Porsche', 'Ferrari',
    'Lamborghini', 'Maserati', 'Bentley', 'Rolls Royce', 'Aston Martin', 'Bugatti', 'Pagani',
    'McLaren', 'Volvo', 'Jeep', 'Chrysler', 'Dodge', 'Ram', 'GMC', 'Buick', 'Cadillac'
  ];

  const colors = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown',
    'Gray', 'Silver', 'Gold', 'Beige', 'Maroon', 'Navy', 'Teal', 'Lime', 'Olive', 'Coral'
  ];

  useEffect(() => {
    retrieveRestoId();
  }, []);

  const retrieveRestoId = async () => {
    try {
      const value = await AsyncStorage.getItem('restoId');
      if (value !== null) {
        setRestoId(value);
      }
    } catch (error) {
      console.error('Error retrieving restoId from AsyncStorage:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');

      if (!customerToken) {
        console.error('tableToken not found in AsyncStorage');
        return;
      }

      const config = {
        headers: {
          Authorization: customerToken,
        },
      };

      const response = await axios.post(
        `${ipAddress}/api/ButtonsRoutes/AddCar`,
        {
          ticketNum: id,
          restoId: restoId,
          carName: selectedCarName,
          color: selectedColor,
        },
        config
      );

      setTimeout(async () => {
        console.log("wait")
        const { timerId } = response.data;
        await AsyncStorage.setItem('timerId', timerId);
      }, 2000);

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('CarTimer');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderDropdown = (data, searchValue, setSearchValue, setSelectedValue, isVisible, setIsVisible) => (
    <View style={styles.dropdownContainer}>
      {isVisible && (
        <TextInput
          style={styles.input}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search"
          placeholderTextColor="#ccc"
        />
      )}
      {isVisible && (
        <FlatList
          data={data.filter(item => item.toLowerCase().includes(searchValue.toLowerCase()))}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedValue(item);
                setIsVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Enter _id:</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="Enter _id"
          placeholderTextColor="#ccc"
        />

        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={styles.label}>Select Car Name:</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsCarDropdownVisible(!isCarDropdownVisible)}
            >
              <Text style={styles.dropdownButtonText}>{selectedCarName || "Select Car Name"}</Text>
            </TouchableOpacity>
            {renderDropdown(carNames, carNameSearch, setCarNameSearch, setSelectedCarName, isCarDropdownVisible, setIsCarDropdownVisible)}
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Select Color:</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsColorDropdownVisible(!isColorDropdownVisible)}
            >
              <Text style={styles.dropdownButtonText}>{selectedColor || "Select Color"}</Text>
            </TouchableOpacity>
            {renderDropdown(colors, colorSearch, setColorSearch, setSelectedColor, isColorDropdownVisible, setIsColorDropdownVisible)}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Car requested successfully!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 400,
    borderColor: '#fff',
    borderWidth: 1,
    color: 'white',
    fontWeight:'bold',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
  },
  dropdownButton: {
    height: 40,
    width: '100%',
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dropdownButtonText: {
    color: '#000',
    fontSize: 16,
  },
  dropdownContainer: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    color: '#000',
    fontSize: 16,
  },
  submitButton: {
    marginTop:20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
        color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ValetScreen;
