import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button,Modal, StyleSheet,Animated, ScrollView, TouchableOpacity, TextInput,  Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../config';

const AnimatedModal = Animated.createAnimatedComponent(Modal);
const SurveyScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foodQuality, setFoodQuality] = useState('');
  const [serviceQuality, setServiceQuality] = useState('');
  const [staffFriendliness, setStaffFriendliness] = useState('');
  const [valueForMoney, setValueForMoney] = useState('');
  const [restaurantCleanliness, setRestaurantCleanliness] = useState('');
  const [restaurantDesign, setRestaurantDesign] = useState('');
  const [wayTrixService, setWayTrixService] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [tableId, setTableId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    AsyncStorage.getItem('tableId').then(value => {
      setTableId(value);
    });
  }, []);
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);
  
  const handleQualitySelection = (quality, setter) => {
    setter(quality);
  };


  const handleSubmit = async () => {
    try {
      const tableToken = await AsyncStorage.getItem('tableToken');
  
      const data = {
        foodQuality,
        serviceQuality,
        staffFriendliness,
        valueForMoney,
        restaurantCleanliness,
        restaurantDesign,
        wayTrixService,
        additionalComments,
        name,
        phone,
        tableId
      };
  
      axios.post(`${ipAddress}/api/ContactUsRoutes/AddSurvey`, data, {
        headers: {
          Authorization: `${tableToken}`
        }
      })
      .then(response => {
        // Alert.alert('Survey submitted successfully');
        setModalVisible(true); // Show modal on success
        setTimeout(() => {
          setModalVisible(false); 
          setTimeout(() => {
            navigation.navigate('Home')
          }, 1500);
        }, 4000);
  
        setName('');
        setPhone('');
        setFoodQuality('');
        setServiceQuality('');
        setStaffFriendliness('');
        setValueForMoney('');
        setRestaurantCleanliness('');
        setRestaurantDesign('');
        setWayTrixService('');
        setAdditionalComments('');
      })
      .catch(error => {
        Alert.alert('Some fields are missing');
        console.error('Error submitting survey:', error);
      });
    } catch (error) {
      console.error('Error retrieving tableToken from AsyncStorage:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setName}
          value={name}
          placeholder="ENTER YOUR NAME"
          placeholderTextColor="#b8b8b8" 
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setPhone}
          value={phone}
          placeholder="ENTER YOUR PHONE NUMBER"
          placeholderTextColor="#b8b8b8" 
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>QUALITY OF FOOD:</Text>
        <View style={styles.buttonContainer}>
          <Button  title="Excellent" onPress={() => handleQualitySelection('Excellent', setFoodQuality)} color={foodQuality === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setFoodQuality)} color={foodQuality === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setFoodQuality)} color={foodQuality === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setFoodQuality)} color={foodQuality === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* Repeat similar structures for other questions */}
      {/* Service Quality */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>QUALITY OF SERVICE:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setServiceQuality)} color={serviceQuality === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setServiceQuality)} color={serviceQuality === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setServiceQuality)} color={serviceQuality === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setServiceQuality)} color={serviceQuality === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* Friendliness of Staff */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>FRIENDLINESS OF STAFF:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setStaffFriendliness)} color={staffFriendliness === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setStaffFriendliness)} color={staffFriendliness === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setStaffFriendliness)} color={staffFriendliness === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setStaffFriendliness)} color={staffFriendliness === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* Value for Money */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>VALUE FOR MONEY:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setValueForMoney)} color={valueForMoney === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setValueForMoney)} color={valueForMoney === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setValueForMoney)} color={valueForMoney === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setValueForMoney)} color={valueForMoney === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* Cleanliness of Restaurant */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>CLEANLINESS OF RESTAURANT:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setRestaurantCleanliness)} color={restaurantCleanliness === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setRestaurantCleanliness)} color={restaurantCleanliness === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setRestaurantCleanliness)} color={restaurantCleanliness === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setRestaurantCleanliness)} color={restaurantCleanliness === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* Restaurant Design */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>RESTAURANT DESIGN:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setRestaurantDesign)} color={restaurantDesign === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setRestaurantDesign)} color={restaurantDesign === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setRestaurantDesign)} color={restaurantDesign === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setRestaurantDesign)} color={restaurantDesign === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      {/* WayTrix Device Service */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>WAYTRIX DEVICE SERVICE:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setWayTrixService)} color={wayTrixService === 'Excellent' ? 'green' : '#8e8a9b'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setWayTrixService)} color={wayTrixService === 'Good' ? '#90EE90' : '#8e8a9b'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setWayTrixService)} color={wayTrixService === 'Average' ? '#b5ad26' : '#8e8a9b'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setWayTrixService)} color={wayTrixService === 'Poor' ? 'red' : '#8e8a9b'} />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>ADDITIONAL COMMENTS:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setAdditionalComments}
          value={additionalComments}
          placeholder="ENTER YOUR COMMENTS HERE"
          placeholderTextColor="#b8b8b8" 
          multiline
        />
      </View>
      <AnimatedModal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <Text style={styles.modalText}>Survey submitted successfully,</Text>
          <Text style={styles.modalText}>Thanks for your review</Text>

          
        </Animated.View>
      </View>
    </AnimatedModal>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'black', // Background color changed to black
  },
  questionContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // Text color changed to white
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContent: {
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#54525a', // Darker background for input
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 4,
    padding: 10,
    color: 'white', // Text color inside inputs changed to white
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#54525a', // Darker button background
    borderWidth: 4,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },
});


export default SurveyScreen;
