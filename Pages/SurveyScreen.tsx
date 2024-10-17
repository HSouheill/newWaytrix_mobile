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
        <TouchableOpacity
          style={[styles.ratingButton, foodQuality === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
          onPress={() => handleQualitySelection('Excellent', setFoodQuality)}
        >
          <Text style={styles.buttonText}>Excellent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.ratingButton, foodQuality === 'Good' ? styles.goodButton : styles.defaultButton]}
          onPress={() => handleQualitySelection('Good', setFoodQuality)}
        >
          <Text style={styles.buttonText}>Good</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.ratingButton, foodQuality === 'Average' ? styles.averageButton : styles.defaultButton]}
          onPress={() => handleQualitySelection('Average', setFoodQuality)}
        >
          <Text style={styles.buttonText}>Average</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.ratingButton, foodQuality === 'Poor' ? styles.poorButton : styles.defaultButton]}
          onPress={() => handleQualitySelection('Poor', setFoodQuality)}
        >
          <Text style={styles.buttonText}>Poor</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Repeat similar structures for other questions */}
      {/* Service Quality */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>QUALITY OF SERVICE:</Text>
        <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.ratingButton, serviceQuality === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
        onPress={() => handleQualitySelection('Excellent', setServiceQuality)}
      >
        <Text style={styles.buttonText}>Excellent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ratingButton, serviceQuality === 'Good' ? styles.goodButton : styles.defaultButton]}
        onPress={() => handleQualitySelection('Good', setServiceQuality)}
      >
        <Text style={styles.buttonText}>Good</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ratingButton, serviceQuality === 'Average' ? styles.averageButton : styles.defaultButton]}
        onPress={() => handleQualitySelection('Average', setServiceQuality)}
      >
        <Text style={styles.buttonText}>Average</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ratingButton, serviceQuality === 'Poor' ? styles.poorButton : styles.defaultButton]}
        onPress={() => handleQualitySelection('Poor', setServiceQuality)}
      >
        <Text style={styles.buttonText}>Poor</Text>
      </TouchableOpacity>
    </View>
      </View>

      {/* Friendliness of Staff */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>FRIENDLINESS OF STAFF:</Text>
        <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.ratingButton, staffFriendliness === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
      onPress={() => handleQualitySelection('Excellent', setStaffFriendliness)}
    >
      <Text style={styles.buttonText}>Excellent</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ratingButton, staffFriendliness === 'Good' ? styles.goodButton : styles.defaultButton]}
      onPress={() => handleQualitySelection('Good', setStaffFriendliness)}
    >
      <Text style={styles.buttonText}>Good</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ratingButton, staffFriendliness === 'Average' ? styles.averageButton : styles.defaultButton]}
      onPress={() => handleQualitySelection('Average', setStaffFriendliness)}
    >
      <Text style={styles.buttonText}>Average</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.ratingButton, staffFriendliness === 'Poor' ? styles.poorButton : styles.defaultButton]}
      onPress={() => handleQualitySelection('Poor', setStaffFriendliness)}
    >
      <Text style={styles.buttonText}>Poor</Text>
    </TouchableOpacity>
      </View>
      </View>

      {/* Value for Money */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>VALUE FOR MONEY:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.ratingButton, valueForMoney === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Excellent', setValueForMoney)}
  >
    <Text style={styles.buttonText}>Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, valueForMoney === 'Good' ? styles.goodButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Good', setValueForMoney)}
  >
    <Text style={styles.buttonText}>Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, valueForMoney === 'Average' ? styles.averageButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Average', setValueForMoney)}
  >
    <Text style={styles.buttonText}>Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, valueForMoney === 'Poor' ? styles.poorButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Poor', setValueForMoney)}
  >
    <Text style={styles.buttonText}>Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Cleanliness of Restaurant */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>CLEANLINESS OF RESTAURANT:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.ratingButton, restaurantCleanliness === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Excellent', setRestaurantCleanliness)}
  >
    <Text style={styles.buttonText}>Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantCleanliness === 'Good' ? styles.goodButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Good', setRestaurantCleanliness)}
  >
    <Text style={styles.buttonText}>Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantCleanliness === 'Average' ? styles.averageButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Average', setRestaurantCleanliness)}
  >
    <Text style={styles.buttonText}>Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantCleanliness === 'Poor' ? styles.poorButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Poor', setRestaurantCleanliness)}
  >
    <Text style={styles.buttonText}>Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Restaurant Design */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>RESTAURANT DESIGN:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.ratingButton, restaurantDesign === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Excellent', setRestaurantDesign)}
  >
    <Text style={styles.buttonText}>Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantDesign === 'Good' ? styles.goodButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Good', setRestaurantDesign)}
  >
    <Text style={styles.buttonText}>Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantDesign === 'Average' ? styles.averageButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Average', setRestaurantDesign)}
  >
    <Text style={styles.buttonText}>Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, restaurantDesign === 'Poor' ? styles.poorButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Poor', setRestaurantDesign)}
  >
    <Text style={styles.buttonText}>Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* WayTrix Device Service */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>WAYTRIX DEVICE SERVICE:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.ratingButton, wayTrixService === 'Excellent' ? styles.excellentButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Excellent', setWayTrixService)}
  >
    <Text style={styles.buttonText}>Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, wayTrixService === 'Good' ? styles.goodButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Good', setWayTrixService)}
  >
    <Text style={styles.buttonText}>Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, wayTrixService === 'Average' ? styles.averageButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Average', setWayTrixService)}
  >
    <Text style={styles.buttonText}>Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.ratingButton, wayTrixService === 'Poor' ? styles.poorButton : styles.defaultButton]}
    onPress={() => handleQualitySelection('Poor', setWayTrixService)}
  >
    <Text style={styles.buttonText}>Poor</Text>
  </TouchableOpacity>
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
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'black',
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
    fontWeight: 'bold',
    borderRadius: 4,
    padding: 10,
    color: 'white', // Text color inside inputs changed to white
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: '#8e8a9b', // Darker button background
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

  ratingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: '#8e8a9b',
    borderColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },
  
  defaultButton: {
    backgroundColor: '#8e8a9b', // Default background color for unselected buttons
  },
  
  excellentButton: {
    backgroundColor: 'green', // Background color for Excellent
  },
  
  goodButton: {
    backgroundColor: '#90EE90', // Background color for Good
  },
  
  averageButton: {
    backgroundColor: '#b5ad26', // Background color for Average
  },
  
  poorButton: {
    backgroundColor: 'red', // Background color for Poor
  },
  
});


export default SurveyScreen;
